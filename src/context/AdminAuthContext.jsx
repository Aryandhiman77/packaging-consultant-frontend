import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const AUTH_KEY = "pcusa-admin-jwt";

const AdminAuthContext = createContext(null);

function tokenExpiry(token) {
  try {
    const parts = token.split(".");

    if (parts.length !== 3) return 0;

    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");

    const payload = JSON.parse(atob(base64));

    return typeof payload.exp === "number" ? payload.exp * 1000 : 0;
  } catch {
    return 0;
  }
}

function readSession() {
  try {
    const token = sessionStorage.getItem(AUTH_KEY) || "";

    if (token && tokenExpiry(token) > Date.now()) {
      return token;
    }

    sessionStorage.removeItem(AUTH_KEY);
  } catch {
    // Browser storage may be blocked
  }

  return "";
}

export function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(readSession);

  const expiresAt = useMemo(() => tokenExpiry(token), [token]);

  const signOut = useCallback(() => {
    try {
      sessionStorage.removeItem(AUTH_KEY);
    } catch {
      // Ignore storage errors
    }

    setToken("");
  }, []);

  const signIn = useCallback((newToken) => {
    if (!newToken || tokenExpiry(newToken) <= Date.now()) {
      throw new Error("Invalid or expired admin session");
    }

    sessionStorage.setItem(AUTH_KEY, newToken);

    setToken(newToken);
  }, []);

  useEffect(() => {
    if (!token) return;

    const remaining = expiresAt - Date.now();

    if (remaining <= 0) {
      signOut();
      return;
    }

    const timer = setTimeout(signOut, Math.min(remaining, 2147483647));

    return () => clearTimeout(timer);
  }, [token, expiresAt, signOut]);

  const value = useMemo(
    () => ({
      token,
      expiresAt,
      isAuthenticated: Boolean(token && expiresAt > Date.now()),
      signIn,
      signOut,
    }),
    [token, expiresAt, signIn, signOut],
  );

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);

  if (!context) {
    throw new Error("AdminAuthProvider is missing");
  }

  return context;
}

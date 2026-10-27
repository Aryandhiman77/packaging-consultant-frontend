import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { useAdminAuth } from "./AdminAuthContext";
import { serializeProjectReviewForApi } from "../utils/projectReviewValidation";

const ApiContext = createContext(null);

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(message, status, details) {
    super(message);

    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

function getErrorMessage(payload, status) {
  if (Array.isArray(payload?.errors) && payload.errors.length) {
    return payload.errors
      .map(({ field, message }) => `${field}: ${message}`)
      .join("; ");
  }

  return payload?.message || `Request failed (${status})`;
}

export function ApiProvider({ children }) {
  const { token, signOut } = useAdminAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(
    async (path, options = {}) => {
      const {
        tokenOverride,
        skipAuthInvalidation,
        responseType,
        ...fetchOptions
      } = options;

      const isAdmin = path === "/api/admin" || path.startsWith("/api/admin/");

      const currentToken = tokenOverride ?? token;

      const headers = new Headers(fetchOptions.headers || {});

      if (isAdmin && currentToken) {
        headers.set("Authorization", `Bearer ${currentToken}`);
      }

      // Never manually set Content-Type for FormData.
      if (
        fetchOptions.body != null &&
        !(fetchOptions.body instanceof FormData) &&
        !headers.has("Content-Type")
      ) {
        headers.set("Content-Type", "application/json");
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${BASE_URL}${path}`, {
          ...fetchOptions,
          headers,
        });

        const data =
          responseType === "blob" && response.ok
            ? await response.blob()
            : await response.json().catch(() => ({}));

        if (!response.ok) {
          if (isAdmin && response.status === 401 && !skipAuthInvalidation) {
            signOut();
          }

          throw new ApiError(
            getErrorMessage(data, response.status),
            response.status,
            data?.errors,
          );
        }

        return response.status === 204 ? null : data;
      } catch (err) {
        const apiError =
          err instanceof TypeError
            ? new ApiError("Cannot reach backend API", 0)
            : err;

        setError(apiError);
        throw apiError;
      } finally {
        setLoading(false);
      }
    },
    [token, signOut],
  );

  // PUBLIC
  const getApiHealth = useCallback(() => request("/api/health"), [request]);

  const getPublicNavigation = useCallback(
    () => request("/api/settings/navigation"),
    [request],
  );

  // ADMIN AUTHENTICATION
  const loginAdmin = useCallback(
    (email, password) =>
      request("/api/admin/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        skipAuthInvalidation: true,
      }),
    [request],
  );

  const checkAdminToken = useCallback(
    async (candidate) => {
      const result = await request("/api/admin/auth/check", {
        tokenOverride: candidate,
        skipAuthInvalidation: true,
      });

      if (result?.authenticated !== true || result.role !== "admin") {
        throw new ApiError("JWT verification failed", 401);
      }

      return result;
    },
    [request],
  );

  // ADMIN SETTINGS
  const getAdminSettings = useCallback(
    () => request("/api/admin/settings/current"),
    [request],
  );

  const saveAdminSettings = useCallback(
    (topNavigation, socialLinks) =>
      request("/api/admin/settings/current", {
        method: "PUT",
        body: JSON.stringify({
          topNavigation,
          socialLinks,
        }),
      }),
    [request],
  );

  // ADDITIONAL SETTINGS CRUD
  const listSettings = useCallback(
    () => request("/api/admin/settings"),
    [request],
  );

  const getSettingsById = useCallback(
    (id) => request(`/api/admin/settings/${encodeURIComponent(id)}`),
    [request],
  );

  const createSettings = useCallback(
    (payload) =>
      request("/api/admin/settings", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    [request],
  );

  const updateSettingsById = useCallback(
    (id, payload, method = "PATCH") =>
      request(`/api/admin/settings/${encodeURIComponent(id)}`, {
        method,
        body: JSON.stringify(payload),
      }),
    [request],
  );

  const deleteSettingsById = useCallback(
    (id) =>
      request(`/api/admin/settings/${encodeURIComponent(id)}`, {
        method: "DELETE",
      }),
    [request],
  );

  // PUBLIC PROJECT REVIEW SUBMISSION
  const submitProjectReview = useCallback(
    async (values, files = [], onUploadProgress) => {
      const form = new FormData();

      form.append("review", JSON.stringify(serializeProjectReviewForApi(values)));

      files.forEach((file) => {
        form.append("files", file, file.name);
      });

      setLoading(true);
      setError(null);

      try {
        const { default: axios } = await import("axios");
        const response = await axios.post(`${BASE_URL}/api/project-reviews`, form, {
          onUploadProgress: (event) => {
            if (!onUploadProgress) return;

            const progress = event.total
              ? event.loaded / event.total
              : event.progress;

            if (typeof progress === "number") {
              onUploadProgress(
                Math.min(100, Math.max(0, Math.round(progress * 100))),
              );
            }
          },
        });

        onUploadProgress?.(100);
        return response.data;
      } catch (error) {
        const status = error.response?.status || 0;
        const payload = error.response?.data;
        const apiError = new ApiError(
          status ? getErrorMessage(payload, status) : "Cannot reach backend API",
          status,
          payload?.errors,
        );

        setError(apiError);
        throw apiError;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // ADMIN: ALL PROJECT REVIEWS
  const listProjectReviews = useCallback(
    (filters = {}) => {
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.set(key, String(value));
        }
      });

      return request(`/api/admin/project-reviews?${params}`);
    },
    [request],
  );

  // ADMIN: SINGLE REVIEW
  const getProjectReview = useCallback(
    (id) => request(`/api/admin/project-reviews/${encodeURIComponent(id)}`),
    [request],
  );

  // ADMIN: STATUS + NOTES
  const updateProjectReview = useCallback(
    (id, payload) =>
      request(`/api/admin/project-reviews/${encodeURIComponent(id)}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    [request],
  );

  // ADMIN: PRIVATE FILE DOWNLOAD
  const downloadProjectReviewFile = useCallback(
    (id, fileId) =>
      request(
        `/api/admin/project-reviews/${encodeURIComponent(id)}/files/${encodeURIComponent(fileId)}`,
        {
          responseType: "blob",
        },
      ),
    [request],
  );

  const value = useMemo(
    () => ({
      request,
      loading,
      error,

      getApiHealth,
      getPublicNavigation,

      loginAdmin,
      checkAdminToken,

      getAdminSettings,
      saveAdminSettings,

      listSettings,
      getSettingsById,
      createSettings,
      updateSettingsById,
      deleteSettingsById,

      submitProjectReview,

      listProjectReviews,
      getProjectReview,
      updateProjectReview,
      downloadProjectReviewFile,
    }),
    [
      request,
      loading,
      error,
      getApiHealth,
      getPublicNavigation,
      loginAdmin,
      checkAdminToken,
      getAdminSettings,
      saveAdminSettings,
      listSettings,
      getSettingsById,
      createSettings,
      updateSettingsById,
      deleteSettingsById,
      submitProjectReview,
      listProjectReviews,
      getProjectReview,
      updateProjectReview,
      downloadProjectReviewFile,
    ],
  );

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}

export function useApi() {
  const context = useContext(ApiContext);

  if (!context) {
    throw new Error("ApiProvider is missing");
  }

  return context;
}

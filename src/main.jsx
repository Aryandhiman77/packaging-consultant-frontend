import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { AdminAuthProvider } from "./context/AdminAuthContext";

import { ApiProvider } from "./context/ApiContext";

import { ReviewDraftProvider } from "./context/ReviewDraftContext";

import App from "./App";

import "@fontsource/anton/400.css";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AdminAuthProvider>
      <ApiProvider>
        <ReviewDraftProvider>
          <App />
        </ReviewDraftProvider>
      </ApiProvider>
    </AdminAuthProvider>
  </StrictMode>,
);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app";
import { AuthProvider } from "features/auth/index.ts";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./app/styles/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);

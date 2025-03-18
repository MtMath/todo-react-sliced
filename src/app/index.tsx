import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./providers/routes";
import "./styles/index.css";

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

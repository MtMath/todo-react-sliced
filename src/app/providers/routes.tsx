import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "pages/login";
import { AuthGuard } from "features/auth";
import { RegisterPage } from "pages/register";
import { TasksPage } from "pages/tasks";

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/tasks"
        element={
          <AuthGuard>
            <TasksPage />
          </AuthGuard>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

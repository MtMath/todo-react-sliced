import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "./AuthContext";
import { Spinner } from "react-bootstrap";

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuthContext();
  const location = useLocation();

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Carregando...</span>
        </Spinner>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

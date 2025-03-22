import { useState, useEffect, useCallback } from "react";
import {
  LoginCredentials,
  RegisterCredentials,
  PasswordResetRequest,
} from "entities/auth/model/auth";
import { authService } from "./authService";

export interface AuthState {
  user: { id: string; username: string } | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (credentials: RegisterCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  requestPasswordReset: (data: PasswordResetRequest) => Promise<boolean>;
  clearError: () => void;
}

export type UseAuthReturn = AuthState & AuthActions;

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<{ id: string; username: string } | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = () => {
      const userData = authService.getUserData();
      if (userData) {
        setUser(userData);
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        await authService.login(credentials);
        const userData = authService.getUserData();
        setUser(userData);
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro durante login");
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const register = useCallback(
    async (credentials: RegisterCredentials): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        await authService.register(credentials);
        const userData = authService.getUserData();
        setUser(userData);
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro durante registro");
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const logout = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } catch (err) {
      console.error("Erro durante logout:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const requestPasswordReset = useCallback(
    async (data: PasswordResetRequest): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        await authService.requestPasswordReset(data);
        return true;
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Erro ao solicitar redefinição de senha"
        );
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    requestPasswordReset,
    clearError,
  };
};

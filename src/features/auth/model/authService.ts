import axios from "axios";
import {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  PasswordResetRequest,
  TokenPayload,
} from "entities/auth/model/auth";
import { apiClient } from "shared/api/api-client";

export class AuthService {
  private readonly BASE_URL = "/auth";

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        `${this.BASE_URL}/login`,
        credentials
      );
      this.setAuthData(response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Falha na autenticação"
        );
      }
      throw error;
    }
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        `${this.BASE_URL}/register`,
        credentials
      );
      this.setAuthData(response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Falha no registro");
      }
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  }

  async requestPasswordReset(data: PasswordResetRequest): Promise<boolean> {
    try {
      await apiClient.post(`${this.BASE_URL}/forgot-password`, data);
      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message ||
            "Falha ao solicitar redefinição de senha"
        );
      }
      throw error;
    }
  }

  setAuthData(authResponse: AuthResponse): void {
    localStorage.setItem("accessToken", authResponse.accessToken);

    try {
      const decoded = this.decodeJwt(authResponse.accessToken);
      const userData = {
        id: decoded.id,
        username: decoded.username,
      };
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (e) {
      console.error("Erro ao decodificar token:", e);
    }
  }

  private decodeJwt(token: string): TokenPayload {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  }

  getToken(): string | null {
    return localStorage.getItem("accessToken");
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = this.decodeJwt(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch (e) {
      return false;
    }
  }

  getUserData(): { id: string; username: string } | null {
    const userData = localStorage.getItem("user");
    if (userData) {
      return JSON.parse(userData);
    }
    return null;
  }
}

export const authService = new AuthService();

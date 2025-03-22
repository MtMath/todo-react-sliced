export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface TokenPayload {
  id: string;
  username: string;
  iat: number;
  exp: number;
}

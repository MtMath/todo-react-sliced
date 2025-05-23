import { LoginCredentials, RegisterCredentials } from "entities/auth";
import { User } from "entities/user";
import { useState, useEffect } from "react";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      const mockUser: User = {
        id: "1",
        email: credentials.email,
        name: "User Demo",
      };

      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const register = async (
    credentials: RegisterCredentials
  ): Promise<boolean> => {
    try {
      const mockUser: User = {
        id: "1",
        email: credentials.email,
        name: credentials.username,
      };

      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
      return true;
    } catch (error) {
      console.error("Registration failed:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };
};

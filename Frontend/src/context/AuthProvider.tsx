import { useEffect, useRef, useState, type ReactNode } from "react";

import { authService } from "../services/auth.service";

import { AuthContext, type AuthContextType } from "./Auth.context";

import type { AuthUser, LoginPayload } from "../types/auth";

type Props = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  const [loading, setLoading] = useState(true);

  const initialized = useRef(false);

  const refreshUser = async () => {
    try {
      const token = authService.getToken();

      if (!token) {
        setUser(null);

        return;
      }

      const currentUser = await authService.me();

      setUser(currentUser);
    } catch (error) {
      console.error("Erreur récupération utilisateur", error);

      await authService.logout();

      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialized.current) return;

    initialized.current = true;

    void refreshUser();
  }, []);

  const login = async (data: LoginPayload) => {
    const loggedUser = await authService.login(data);

    setUser(loggedUser);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

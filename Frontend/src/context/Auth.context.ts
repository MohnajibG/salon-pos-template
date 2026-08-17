import { createContext } from "react";

import type { AuthUser, LoginPayload } from "../types/auth";

export type AuthContextType = {
  user: AuthUser | null;

  loading: boolean;

  login: (data: LoginPayload) => Promise<void>;

  logout: () => Promise<void>;

  refreshUser: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

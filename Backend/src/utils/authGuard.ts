import type { AuthRequest } from "../types/auth";

export const requireUser = (req: AuthRequest) => {
  if (!req.user) {
    throw new Error("Utilisateur non authentifié");
  }

  return req.user;
};

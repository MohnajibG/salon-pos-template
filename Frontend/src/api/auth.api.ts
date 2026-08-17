import api from "./axios";

import type { LoginPayload, LoginResponse, AuthResponse } from "../types/auth";

class AuthApi {
  async login(data: LoginPayload): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>("/auth/login", data);

    return response.data;
  }

  async me(): Promise<AuthResponse> {
    const response = await api.get<AuthResponse>("/auth/me");

    return response.data;
  }

  async changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    await api.patch("/auth/change-password", {
      currentPassword,
      newPassword,
    });
  }

  async logout(): Promise<void> {
    // logout serveur si nécessaire
  }
}

export const authApi = new AuthApi();

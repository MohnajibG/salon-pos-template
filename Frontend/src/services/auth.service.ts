import { authApi } from "../api/auth.api";

import type { LoginPayload, AuthUser } from "../types/auth";

const TOKEN_KEY = "token";

class AuthService {
  async login(data: LoginPayload): Promise<AuthUser> {
    const { token, user } = await authApi.login(data);

    localStorage.setItem(TOKEN_KEY, token);

    return user;
  }

  async me(): Promise<AuthUser> {
    const response = await authApi.me();

    return response.user;
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return authApi.changePassword(currentPassword, newPassword);
  }

  async logout() {
    localStorage.removeItem(TOKEN_KEY);

    await authApi.logout();
  }

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  isAuthenticated() {
    return Boolean(this.getToken());
  }
}

export const authService = new AuthService();

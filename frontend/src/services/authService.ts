import api from "./api";
import type { User } from "../types";

export interface AuthResponse {
  token: string;
  user: User;
}

export const authService = {
  async login(username: string, password: string): Promise<AuthResponse> {
    const res = await api.post("/auth/login", { username, password });
    return res.data.data;
  },
  async register(
    username: string,
    password: string,
    displayName: string
  ): Promise<AuthResponse> {
    const res = await api.post("/auth/register", {
      username,
      password,
      displayName,
    });
    return res.data.data;
  },
};
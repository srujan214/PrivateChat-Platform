import api from "./api";
import type { User } from "../types";

export interface ChatMessage {
  id?: number;
  senderUsername: string;
  receiverUsername: string;
  content: string;
  type: "TEXT" | "IMAGE" | "GIF" | "VIDEO" | "AUDIO" | "SYSTEM";
  mediaUrl?: string;
  fileName?: string;
  createdAt?: string;
  readAt?: string;
  pending?: boolean;
}

export const chatService = {
  async history(other: string, page = 0, size = 50): Promise<ChatMessage[]> {
    const res = await api.get(`/chat/history/${other}?page=${page}&size=${size}`);
    return res.data.data;
  },
  async me(): Promise<User> {
    const res = await api.get("/users/me");
    return res.data.data;
  },
  async getByUsername(username: string): Promise<User> {
    const res = await api.get(`/users/${username}`);
    return res.data.data;
  },
  async updateProfile(data: Partial<User>): Promise<User> {
    const res = await api.put("/users/me", data);
    return res.data.data;
  },
};
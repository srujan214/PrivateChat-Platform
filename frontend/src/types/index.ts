export interface User {
  id: number;
  username: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  online: boolean;
  lastSeen?: string;
  createdAt?: string;
}
export interface User {
  id: string;
  email: string;
  password?: string;
  fullName: string;
  avatarUrl?: string;
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
}

export interface UserRequest {
  fullName: string;
  avatarUrl: string;
  email: string;
  password: string;
}

import { PaginatedResponse } from "@/interfaces/paginatedResponse";
import { ResourceResponse } from "@/interfaces/authResponse";
import { User, UserRole } from "@/interfaces/user";

export type ListUsersResponse = PaginatedResponse<User>;

export type GetUserResponse = ResourceResponse<User>;

export type UpdateUserResponse = ResourceResponse<User>;

export interface CreateUserPayload {
  admission_date?: string | null;
  birthday?: string | null;
  email: string;
  is_active?: boolean;
  name: string;
  phone?: string | null;
  role?: UserRole;
}

export interface UpdateUserPayload {
  admission_date?: string | null;
  birthday?: string | null;
  current_password?: string;
  email?: string;
  is_active?: boolean;
  name?: string;
  phone?: string | null;
  role?: UserRole;
}

export interface ListUsersParams {
  page?: number;
  perPage?: number;
  search?: string;
  sort?: string;
  direction?: "asc" | "desc";
}

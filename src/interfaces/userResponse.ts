import { PaginatedResponse } from "@/interfaces/paginatedResponse";
import { ResourceResponse } from "@/interfaces/authResponse";
import { User, UserRole } from "@/interfaces/user";

export type ListUsersResponse = PaginatedResponse<User>;

export type GetUserResponse = ResourceResponse<User>;

export type UpdateUserResponse = ResourceResponse<User>;

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  role?: UserRole;
  current_password?: string;
}

export interface ListUsersParams {
  page?: number;
  perPage?: number;
  search?: string;
  sort?: string;
  direction?: "asc" | "desc";
}

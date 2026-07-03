import { User } from "@/interfaces/user";

export interface ResourceResponse<TData> {
  data: TData;
  message?: string | null;
}

export interface AuthenticatedUserData {
  user: User;
  token?: string | null;
  token_type?: string | null;
}

export type LoginResponse = ResourceResponse<AuthenticatedUserData>;

export interface MessageResponse {
  message?: string | null;
}

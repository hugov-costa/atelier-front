import {
  CreateUserPayload,
  GetUserResponse,
  ListUsersParams,
  ListUsersResponse,
  UpdateUserPayload,
  UpdateUserResponse,
} from "@/interfaces/userResponse";
import { MessageResponse } from "@/interfaces/authResponse";
import { apiClient } from "@/lib/api-client";
import {
  paginatedSchema,
  parseApiResponse,
  resourceSchema,
  userResponseSchema,
} from "@/lib/responseSchemas";
import { HttpMethodType } from "@/types/httpMethod";

export function buildListUsersQuery(params: ListUsersParams): string {
  const searchParams = new URLSearchParams();

  if (params.page !== undefined) {
    searchParams.set("page", String(params.page));
  }

  if (params.perPage !== undefined) {
    searchParams.set("per_page", String(params.perPage));
  }

  if (params.search) {
    searchParams.set("search", params.search);
  }

  if (params.sort) {
    searchParams.set("sort", params.sort);
  }

  if (params.direction) {
    searchParams.set("direction", params.direction);
  }

  const query = searchParams.toString();

  return query ? `?${query}` : "";
}

export async function listUsers(
  params: ListUsersParams = {},
): Promise<ListUsersResponse> {
  const response = await apiClient<ListUsersResponse>({
    url: `/users${buildListUsersQuery(params)}`,
    method: HttpMethodType.GET,
    errorMessage: "Erro ao listar usuários.",
  });

  return parseApiResponse(paginatedSchema(userResponseSchema), response);
}

export async function createUser(
  payload: CreateUserPayload,
): Promise<GetUserResponse> {
  const response = await apiClient<GetUserResponse>({
    url: "/users",
    method: HttpMethodType.POST,
    body: payload,
    errorMessage: "Erro ao criar usuário.",
  });

  return parseApiResponse(resourceSchema(userResponseSchema), response);
}

export async function getUser(userId: string): Promise<GetUserResponse> {
  const response = await apiClient<GetUserResponse>({
    url: `/users/${userId}`,
    method: HttpMethodType.GET,
    errorMessage: "Erro ao buscar usuário.",
  });

  return parseApiResponse(resourceSchema(userResponseSchema), response);
}

export async function updateUser(
  userId: string,
  payload: UpdateUserPayload,
): Promise<UpdateUserResponse> {
  const response = await apiClient<UpdateUserResponse>({
    url: `/users/${userId}`,
    method: HttpMethodType.PATCH,
    body: payload,
    errorMessage: "Erro ao atualizar usuário.",
  });

  return parseApiResponse(resourceSchema(userResponseSchema), response);
}

export async function deleteUser(userId: string): Promise<MessageResponse> {
  return apiClient<MessageResponse>({
    url: `/users/${userId}`,
    method: HttpMethodType.DELETE,
    errorMessage: "Erro ao excluir usuário.",
  });
}

export async function eraseUser(userId: string): Promise<MessageResponse> {
  return apiClient<MessageResponse>({
    url: `/users/${userId}/erase`,
    method: HttpMethodType.POST,
    errorMessage: "Erro ao eliminar os dados do usuário.",
  });
}

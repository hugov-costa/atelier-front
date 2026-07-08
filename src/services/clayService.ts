import { MessageResponse } from "@/interfaces/authResponse";
import {
  ClayResourceResponse,
  CreateClayPayload,
  ListClaysParams,
  ListClaysResponse,
  UpdateClayPayload,
} from "@/interfaces/clay";
import { apiClient } from "@/lib/api-client";
import { buildListQuery } from "@/lib/listQuery";
import {
  clayResponseSchema,
  paginatedSchema,
  parseApiResponse,
  resourceSchema,
} from "@/lib/responseSchemas";
import { HttpMethodType } from "@/types/httpMethod";

export async function createClay(
  payload: CreateClayPayload,
): Promise<ClayResourceResponse> {
  const response = await apiClient<ClayResourceResponse>({
    url: "/clays",
    method: HttpMethodType.POST,
    body: payload,
    errorMessage: "Erro ao criar argila.",
  });

  return parseApiResponse(resourceSchema(clayResponseSchema), response);
}

export async function deleteClay(clayId: string): Promise<MessageResponse> {
  return apiClient<MessageResponse>({
    url: `/clays/${clayId}`,
    method: HttpMethodType.DELETE,
    errorMessage: "Erro ao excluir argila.",
  });
}

export async function getClay(clayId: string): Promise<ClayResourceResponse> {
  const response = await apiClient<ClayResourceResponse>({
    url: `/clays/${clayId}`,
    method: HttpMethodType.GET,
    errorMessage: "Erro ao buscar argila.",
  });

  return parseApiResponse(resourceSchema(clayResponseSchema), response);
}

export async function listClays(
  params: ListClaysParams = {},
): Promise<ListClaysResponse> {
  const response = await apiClient<ListClaysResponse>({
    url: `/clays${buildListQuery(params)}`,
    method: HttpMethodType.GET,
    errorMessage: "Erro ao listar argilas.",
  });

  return parseApiResponse(paginatedSchema(clayResponseSchema), response);
}

export async function restoreClay(
  clayId: string,
): Promise<ClayResourceResponse> {
  const response = await apiClient<ClayResourceResponse>({
    url: `/clays/${clayId}/restore`,
    method: HttpMethodType.POST,
    errorMessage: "Erro ao restaurar argila.",
  });

  return parseApiResponse(resourceSchema(clayResponseSchema), response);
}

export async function updateClay(
  clayId: string,
  payload: UpdateClayPayload,
): Promise<ClayResourceResponse> {
  const response = await apiClient<ClayResourceResponse>({
    url: `/clays/${clayId}`,
    method: HttpMethodType.PATCH,
    body: payload,
    errorMessage: "Erro ao atualizar argila.",
  });

  return parseApiResponse(resourceSchema(clayResponseSchema), response);
}

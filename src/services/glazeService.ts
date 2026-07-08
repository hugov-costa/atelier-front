import { MessageResponse } from "@/interfaces/authResponse";
import {
  CreateGlazePayload,
  GlazeResourceResponse,
  ListGlazesParams,
  ListGlazesResponse,
  UpdateGlazePayload,
} from "@/interfaces/glaze";
import { apiClient } from "@/lib/api-client";
import { buildListQuery } from "@/lib/listQuery";
import {
  glazeResponseSchema,
  paginatedSchema,
  parseApiResponse,
  resourceSchema,
} from "@/lib/responseSchemas";
import { HttpMethodType } from "@/types/httpMethod";

export async function createGlaze(
  payload: CreateGlazePayload,
): Promise<GlazeResourceResponse> {
  const response = await apiClient<GlazeResourceResponse>({
    url: "/glazes",
    method: HttpMethodType.POST,
    body: payload,
    errorMessage: "Erro ao criar esmalte.",
  });

  return parseApiResponse(resourceSchema(glazeResponseSchema), response);
}

export async function deleteGlaze(glazeId: string): Promise<MessageResponse> {
  return apiClient<MessageResponse>({
    url: `/glazes/${glazeId}`,
    method: HttpMethodType.DELETE,
    errorMessage: "Erro ao excluir esmalte.",
  });
}

export async function getGlaze(
  glazeId: string,
): Promise<GlazeResourceResponse> {
  const response = await apiClient<GlazeResourceResponse>({
    url: `/glazes/${glazeId}`,
    method: HttpMethodType.GET,
    errorMessage: "Erro ao buscar esmalte.",
  });

  return parseApiResponse(resourceSchema(glazeResponseSchema), response);
}

export async function listGlazes(
  params: ListGlazesParams = {},
): Promise<ListGlazesResponse> {
  const response = await apiClient<ListGlazesResponse>({
    url: `/glazes${buildListQuery(params)}`,
    method: HttpMethodType.GET,
    errorMessage: "Erro ao listar esmaltes.",
  });

  return parseApiResponse(paginatedSchema(glazeResponseSchema), response);
}

export async function restoreGlaze(
  glazeId: string,
): Promise<GlazeResourceResponse> {
  const response = await apiClient<GlazeResourceResponse>({
    url: `/glazes/${glazeId}/restore`,
    method: HttpMethodType.POST,
    errorMessage: "Erro ao restaurar esmalte.",
  });

  return parseApiResponse(resourceSchema(glazeResponseSchema), response);
}

export async function updateGlaze(
  glazeId: string,
  payload: UpdateGlazePayload,
): Promise<GlazeResourceResponse> {
  const response = await apiClient<GlazeResourceResponse>({
    url: `/glazes/${glazeId}`,
    method: HttpMethodType.PATCH,
    body: payload,
    errorMessage: "Erro ao atualizar esmalte.",
  });

  return parseApiResponse(resourceSchema(glazeResponseSchema), response);
}

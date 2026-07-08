import { MessageResponse } from "@/interfaces/authResponse";
import {
  CreateRecurrentClassPayload,
  ListRecurrentClassesParams,
  ListRecurrentClassesResponse,
  RecurrentClassResourceResponse,
  UpdateRecurrentClassPayload,
} from "@/interfaces/recurrentClass";
import { apiClient } from "@/lib/api-client";
import { buildListQuery } from "@/lib/listQuery";
import {
  paginatedSchema,
  parseApiResponse,
  recurrentClassResponseSchema,
  resourceSchema,
} from "@/lib/responseSchemas";
import { HttpMethodType } from "@/types/httpMethod";

export async function createRecurrentClass(
  payload: CreateRecurrentClassPayload,
): Promise<RecurrentClassResourceResponse> {
  const response = await apiClient<RecurrentClassResourceResponse>({
    url: "/recurrent-classes",
    method: HttpMethodType.POST,
    body: payload,
    errorMessage: "Erro ao criar aula recorrente.",
  });

  return parseApiResponse(
    resourceSchema(recurrentClassResponseSchema),
    response,
  );
}

export async function deleteRecurrentClass(
  recurrentClassId: string,
): Promise<MessageResponse> {
  return apiClient<MessageResponse>({
    url: `/recurrent-classes/${recurrentClassId}`,
    method: HttpMethodType.DELETE,
    errorMessage: "Erro ao excluir aula recorrente.",
  });
}

export async function getRecurrentClass(
  recurrentClassId: string,
): Promise<RecurrentClassResourceResponse> {
  const response = await apiClient<RecurrentClassResourceResponse>({
    url: `/recurrent-classes/${recurrentClassId}`,
    method: HttpMethodType.GET,
    errorMessage: "Erro ao buscar aula recorrente.",
  });

  return parseApiResponse(
    resourceSchema(recurrentClassResponseSchema),
    response,
  );
}

export async function listRecurrentClasses(
  params: ListRecurrentClassesParams = {},
): Promise<ListRecurrentClassesResponse> {
  const response = await apiClient<ListRecurrentClassesResponse>({
    url: `/recurrent-classes${buildListQuery(params)}`,
    method: HttpMethodType.GET,
    errorMessage: "Erro ao listar aulas recorrentes.",
  });

  return parseApiResponse(
    paginatedSchema(recurrentClassResponseSchema),
    response,
  );
}

export async function restoreRecurrentClass(
  recurrentClassId: string,
): Promise<RecurrentClassResourceResponse> {
  const response = await apiClient<RecurrentClassResourceResponse>({
    url: `/recurrent-classes/${recurrentClassId}/restore`,
    method: HttpMethodType.POST,
    errorMessage: "Erro ao restaurar aula recorrente.",
  });

  return parseApiResponse(
    resourceSchema(recurrentClassResponseSchema),
    response,
  );
}

export async function updateRecurrentClass(
  recurrentClassId: string,
  payload: UpdateRecurrentClassPayload,
): Promise<RecurrentClassResourceResponse> {
  const response = await apiClient<RecurrentClassResourceResponse>({
    url: `/recurrent-classes/${recurrentClassId}`,
    method: HttpMethodType.PATCH,
    body: payload,
    errorMessage: "Erro ao atualizar aula recorrente.",
  });

  return parseApiResponse(
    resourceSchema(recurrentClassResponseSchema),
    response,
  );
}

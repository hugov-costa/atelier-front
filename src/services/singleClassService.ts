import { MessageResponse } from "@/interfaces/authResponse";
import {
  CreateSingleClassPayload,
  ListSingleClassesParams,
  ListSingleClassesResponse,
  SingleClassResourceResponse,
  UpdateSingleClassPayload,
} from "@/interfaces/singleClass";
import { apiClient } from "@/lib/api-client";
import { buildListQuery } from "@/lib/listQuery";
import {
  paginatedSchema,
  parseApiResponse,
  resourceSchema,
  singleClassResponseSchema,
} from "@/lib/responseSchemas";
import { HttpMethodType } from "@/types/httpMethod";

export async function createSingleClass(
  payload: CreateSingleClassPayload,
): Promise<SingleClassResourceResponse> {
  const response = await apiClient<SingleClassResourceResponse>({
    url: "/single-classes",
    method: HttpMethodType.POST,
    body: payload,
    errorMessage: "Erro ao criar aula avulsa.",
  });

  return parseApiResponse(resourceSchema(singleClassResponseSchema), response);
}

export async function deleteSingleClass(
  singleClassId: string,
): Promise<MessageResponse> {
  return apiClient<MessageResponse>({
    url: `/single-classes/${singleClassId}`,
    method: HttpMethodType.DELETE,
    errorMessage: "Erro ao excluir aula avulsa.",
  });
}

export async function getSingleClass(
  singleClassId: string,
): Promise<SingleClassResourceResponse> {
  const response = await apiClient<SingleClassResourceResponse>({
    url: `/single-classes/${singleClassId}`,
    method: HttpMethodType.GET,
    errorMessage: "Erro ao buscar aula avulsa.",
  });

  return parseApiResponse(resourceSchema(singleClassResponseSchema), response);
}

export async function listSingleClasses(
  params: ListSingleClassesParams = {},
): Promise<ListSingleClassesResponse> {
  const response = await apiClient<ListSingleClassesResponse>({
    url: `/single-classes${buildListQuery(params)}`,
    method: HttpMethodType.GET,
    errorMessage: "Erro ao listar aulas avulsas.",
  });

  return parseApiResponse(paginatedSchema(singleClassResponseSchema), response);
}

export async function restoreSingleClass(
  singleClassId: string,
): Promise<SingleClassResourceResponse> {
  const response = await apiClient<SingleClassResourceResponse>({
    url: `/single-classes/${singleClassId}/restore`,
    method: HttpMethodType.POST,
    errorMessage: "Erro ao restaurar aula avulsa.",
  });

  return parseApiResponse(resourceSchema(singleClassResponseSchema), response);
}

export async function updateSingleClass(
  singleClassId: string,
  payload: UpdateSingleClassPayload,
): Promise<SingleClassResourceResponse> {
  const response = await apiClient<SingleClassResourceResponse>({
    url: `/single-classes/${singleClassId}`,
    method: HttpMethodType.PATCH,
    body: payload,
    errorMessage: "Erro ao atualizar aula avulsa.",
  });

  return parseApiResponse(resourceSchema(singleClassResponseSchema), response);
}

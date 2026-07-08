import { MessageResponse } from "@/interfaces/authResponse";
import {
  CreateFiringCyclePayload,
  FiringCycleResourceResponse,
  ListFiringCyclesParams,
  ListFiringCyclesResponse,
  UpdateFiringCyclePayload,
} from "@/interfaces/firingCycle";
import { apiClient } from "@/lib/api-client";
import { buildListQuery } from "@/lib/listQuery";
import {
  firingCycleResponseSchema,
  paginatedSchema,
  parseApiResponse,
  resourceSchema,
} from "@/lib/responseSchemas";
import { HttpMethodType } from "@/types/httpMethod";

export async function createFiringCycle(
  payload: CreateFiringCyclePayload,
): Promise<FiringCycleResourceResponse> {
  const response = await apiClient<FiringCycleResourceResponse>({
    url: "/firing-cycles",
    method: HttpMethodType.POST,
    body: payload,
    errorMessage: "Erro ao criar ciclo de queima.",
  });

  return parseApiResponse(resourceSchema(firingCycleResponseSchema), response);
}

export async function deleteFiringCycle(
  firingCycleId: string,
): Promise<MessageResponse> {
  return apiClient<MessageResponse>({
    url: `/firing-cycles/${firingCycleId}`,
    method: HttpMethodType.DELETE,
    errorMessage: "Erro ao excluir ciclo de queima.",
  });
}

export async function getFiringCycle(
  firingCycleId: string,
): Promise<FiringCycleResourceResponse> {
  const response = await apiClient<FiringCycleResourceResponse>({
    url: `/firing-cycles/${firingCycleId}`,
    method: HttpMethodType.GET,
    errorMessage: "Erro ao buscar ciclo de queima.",
  });

  return parseApiResponse(resourceSchema(firingCycleResponseSchema), response);
}

export async function listFiringCycles(
  params: ListFiringCyclesParams = {},
): Promise<ListFiringCyclesResponse> {
  const response = await apiClient<ListFiringCyclesResponse>({
    url: `/firing-cycles${buildListQuery(params)}`,
    method: HttpMethodType.GET,
    errorMessage: "Erro ao listar ciclos de queima.",
  });

  return parseApiResponse(paginatedSchema(firingCycleResponseSchema), response);
}

export async function restoreFiringCycle(
  firingCycleId: string,
): Promise<FiringCycleResourceResponse> {
  const response = await apiClient<FiringCycleResourceResponse>({
    url: `/firing-cycles/${firingCycleId}/restore`,
    method: HttpMethodType.POST,
    errorMessage: "Erro ao restaurar ciclo de queima.",
  });

  return parseApiResponse(resourceSchema(firingCycleResponseSchema), response);
}

export async function updateFiringCycle(
  firingCycleId: string,
  payload: UpdateFiringCyclePayload,
): Promise<FiringCycleResourceResponse> {
  const response = await apiClient<FiringCycleResourceResponse>({
    url: `/firing-cycles/${firingCycleId}`,
    method: HttpMethodType.PATCH,
    body: payload,
    errorMessage: "Erro ao atualizar ciclo de queima.",
  });

  return parseApiResponse(resourceSchema(firingCycleResponseSchema), response);
}

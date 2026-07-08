import { MessageResponse } from "@/interfaces/authResponse";
import {
  CreateTuitionFeePayload,
  ListTuitionFeesParams,
  ListTuitionFeesResponse,
  TuitionFeeResourceResponse,
  UpdateTuitionFeePayload,
} from "@/interfaces/tuitionFee";
import { apiClient } from "@/lib/api-client";
import { buildListQuery } from "@/lib/listQuery";
import {
  paginatedSchema,
  parseApiResponse,
  resourceSchema,
  tuitionFeeResponseSchema,
} from "@/lib/responseSchemas";
import { HttpMethodType } from "@/types/httpMethod";

export async function createTuitionFee(
  payload: CreateTuitionFeePayload,
): Promise<TuitionFeeResourceResponse> {
  const response = await apiClient<TuitionFeeResourceResponse>({
    url: "/tuition-fees",
    method: HttpMethodType.POST,
    body: payload,
    errorMessage: "Erro ao gerar mensalidade.",
  });

  return parseApiResponse(resourceSchema(tuitionFeeResponseSchema), response);
}

export async function deleteTuitionFee(
  tuitionFeeId: string,
): Promise<MessageResponse> {
  return apiClient<MessageResponse>({
    url: `/tuition-fees/${tuitionFeeId}`,
    method: HttpMethodType.DELETE,
    errorMessage: "Erro ao excluir mensalidade.",
  });
}

export async function getTuitionFee(
  tuitionFeeId: string,
): Promise<TuitionFeeResourceResponse> {
  const response = await apiClient<TuitionFeeResourceResponse>({
    url: `/tuition-fees/${tuitionFeeId}`,
    method: HttpMethodType.GET,
    errorMessage: "Erro ao buscar mensalidade.",
  });

  return parseApiResponse(resourceSchema(tuitionFeeResponseSchema), response);
}

export async function listTuitionFees(
  params: ListTuitionFeesParams = {},
): Promise<ListTuitionFeesResponse> {
  const response = await apiClient<ListTuitionFeesResponse>({
    url: `/tuition-fees${buildListQuery(params)}`,
    method: HttpMethodType.GET,
    errorMessage: "Erro ao listar mensalidades.",
  });

  return parseApiResponse(paginatedSchema(tuitionFeeResponseSchema), response);
}

export async function restoreTuitionFee(
  tuitionFeeId: string,
): Promise<TuitionFeeResourceResponse> {
  const response = await apiClient<TuitionFeeResourceResponse>({
    url: `/tuition-fees/${tuitionFeeId}/restore`,
    method: HttpMethodType.POST,
    errorMessage: "Erro ao restaurar mensalidade.",
  });

  return parseApiResponse(resourceSchema(tuitionFeeResponseSchema), response);
}

export async function updateTuitionFee(
  tuitionFeeId: string,
  payload: UpdateTuitionFeePayload,
): Promise<TuitionFeeResourceResponse> {
  const response = await apiClient<TuitionFeeResourceResponse>({
    url: `/tuition-fees/${tuitionFeeId}`,
    method: HttpMethodType.PATCH,
    body: payload,
    errorMessage: "Erro ao atualizar mensalidade.",
  });

  return parseApiResponse(resourceSchema(tuitionFeeResponseSchema), response);
}

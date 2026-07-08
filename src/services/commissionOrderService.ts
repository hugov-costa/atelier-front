import { MessageResponse } from "@/interfaces/authResponse";
import {
  CommissionOrderResourceResponse,
  CreateCommissionOrderPayload,
  ListCommissionOrdersParams,
  ListCommissionOrdersResponse,
  UpdateCommissionOrderPayload,
} from "@/interfaces/commissionOrder";
import { apiClient } from "@/lib/api-client";
import { buildListQuery } from "@/lib/listQuery";
import {
  commissionOrderResponseSchema,
  paginatedSchema,
  parseApiResponse,
  resourceSchema,
} from "@/lib/responseSchemas";
import { HttpMethodType } from "@/types/httpMethod";

export async function createCommissionOrder(
  payload: CreateCommissionOrderPayload,
): Promise<CommissionOrderResourceResponse> {
  const response = await apiClient<CommissionOrderResourceResponse>({
    url: "/commission-orders",
    method: HttpMethodType.POST,
    body: payload,
    errorMessage: "Erro ao criar encomenda.",
  });

  return parseApiResponse(
    resourceSchema(commissionOrderResponseSchema),
    response,
  );
}

export async function deleteCommissionOrder(
  commissionOrderId: string,
): Promise<MessageResponse> {
  return apiClient<MessageResponse>({
    url: `/commission-orders/${commissionOrderId}`,
    method: HttpMethodType.DELETE,
    errorMessage: "Erro ao excluir encomenda.",
  });
}

export async function getCommissionOrder(
  commissionOrderId: string,
): Promise<CommissionOrderResourceResponse> {
  const response = await apiClient<CommissionOrderResourceResponse>({
    url: `/commission-orders/${commissionOrderId}`,
    method: HttpMethodType.GET,
    errorMessage: "Erro ao buscar encomenda.",
  });

  return parseApiResponse(
    resourceSchema(commissionOrderResponseSchema),
    response,
  );
}

export async function listCommissionOrders(
  params: ListCommissionOrdersParams = {},
): Promise<ListCommissionOrdersResponse> {
  const response = await apiClient<ListCommissionOrdersResponse>({
    url: `/commission-orders${buildListQuery(params)}`,
    method: HttpMethodType.GET,
    errorMessage: "Erro ao listar encomendas.",
  });

  return parseApiResponse(
    paginatedSchema(commissionOrderResponseSchema),
    response,
  );
}

export async function restoreCommissionOrder(
  commissionOrderId: string,
): Promise<CommissionOrderResourceResponse> {
  const response = await apiClient<CommissionOrderResourceResponse>({
    url: `/commission-orders/${commissionOrderId}/restore`,
    method: HttpMethodType.POST,
    errorMessage: "Erro ao restaurar encomenda.",
  });

  return parseApiResponse(
    resourceSchema(commissionOrderResponseSchema),
    response,
  );
}

export async function updateCommissionOrder(
  commissionOrderId: string,
  payload: UpdateCommissionOrderPayload,
): Promise<CommissionOrderResourceResponse> {
  const response = await apiClient<CommissionOrderResourceResponse>({
    url: `/commission-orders/${commissionOrderId}`,
    method: HttpMethodType.PATCH,
    body: payload,
    errorMessage: "Erro ao atualizar encomenda.",
  });

  return parseApiResponse(
    resourceSchema(commissionOrderResponseSchema),
    response,
  );
}

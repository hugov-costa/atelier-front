import { MessageResponse } from "@/interfaces/authResponse";
import {
  BillResourceResponse,
  CreateBillPayload,
  ListBillsParams,
  ListBillsResponse,
  UpdateBillPayload,
} from "@/interfaces/bill";
import { apiClient } from "@/lib/api-client";
import { buildListQuery } from "@/lib/listQuery";
import {
  billResponseSchema,
  paginatedSchema,
  parseApiResponse,
  resourceSchema,
} from "@/lib/responseSchemas";
import { HttpMethodType } from "@/types/httpMethod";

export async function createBill(
  payload: CreateBillPayload,
): Promise<BillResourceResponse> {
  const response = await apiClient<BillResourceResponse>({
    url: "/bills",
    method: HttpMethodType.POST,
    body: payload,
    errorMessage: "Erro ao criar conta.",
  });

  return parseApiResponse(resourceSchema(billResponseSchema), response);
}

export async function deleteBill(billId: string): Promise<MessageResponse> {
  return apiClient<MessageResponse>({
    url: `/bills/${billId}`,
    method: HttpMethodType.DELETE,
    errorMessage: "Erro ao excluir conta.",
  });
}

export async function getBill(billId: string): Promise<BillResourceResponse> {
  const response = await apiClient<BillResourceResponse>({
    url: `/bills/${billId}`,
    method: HttpMethodType.GET,
    errorMessage: "Erro ao buscar conta.",
  });

  return parseApiResponse(resourceSchema(billResponseSchema), response);
}

export async function listBills(
  params: ListBillsParams = {},
): Promise<ListBillsResponse> {
  const response = await apiClient<ListBillsResponse>({
    url: `/bills${buildListQuery(params)}`,
    method: HttpMethodType.GET,
    errorMessage: "Erro ao listar contas.",
  });

  return parseApiResponse(paginatedSchema(billResponseSchema), response);
}

export async function restoreBill(
  billId: string,
): Promise<BillResourceResponse> {
  const response = await apiClient<BillResourceResponse>({
    url: `/bills/${billId}/restore`,
    method: HttpMethodType.POST,
    errorMessage: "Erro ao restaurar conta.",
  });

  return parseApiResponse(resourceSchema(billResponseSchema), response);
}

export async function updateBill(
  billId: string,
  payload: UpdateBillPayload,
): Promise<BillResourceResponse> {
  const response = await apiClient<BillResourceResponse>({
    url: `/bills/${billId}`,
    method: HttpMethodType.PATCH,
    body: payload,
    errorMessage: "Erro ao atualizar conta.",
  });

  return parseApiResponse(resourceSchema(billResponseSchema), response);
}

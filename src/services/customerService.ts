import { MessageResponse } from "@/interfaces/authResponse";
import {
  CreateCustomerPayload,
  CustomerResourceResponse,
  ListCustomersParams,
  ListCustomersResponse,
  UpdateCustomerPayload,
} from "@/interfaces/customer";
import { apiClient } from "@/lib/api-client";
import { buildListQuery } from "@/lib/listQuery";
import {
  customerResponseSchema,
  paginatedSchema,
  parseApiResponse,
  resourceSchema,
} from "@/lib/responseSchemas";
import { HttpMethodType } from "@/types/httpMethod";

export async function createCustomer(
  payload: CreateCustomerPayload,
): Promise<CustomerResourceResponse> {
  const response = await apiClient<CustomerResourceResponse>({
    url: "/customers",
    method: HttpMethodType.POST,
    body: payload,
    errorMessage: "Erro ao criar cliente.",
  });

  return parseApiResponse(resourceSchema(customerResponseSchema), response);
}

export async function deleteCustomer(
  customerId: string,
): Promise<MessageResponse> {
  return apiClient<MessageResponse>({
    url: `/customers/${customerId}`,
    method: HttpMethodType.DELETE,
    errorMessage: "Erro ao excluir cliente.",
  });
}

export async function getCustomer(
  customerId: string,
): Promise<CustomerResourceResponse> {
  const response = await apiClient<CustomerResourceResponse>({
    url: `/customers/${customerId}`,
    method: HttpMethodType.GET,
    errorMessage: "Erro ao buscar cliente.",
  });

  return parseApiResponse(resourceSchema(customerResponseSchema), response);
}

export async function listCustomers(
  params: ListCustomersParams = {},
): Promise<ListCustomersResponse> {
  const response = await apiClient<ListCustomersResponse>({
    url: `/customers${buildListQuery(params)}`,
    method: HttpMethodType.GET,
    errorMessage: "Erro ao listar clientes.",
  });

  return parseApiResponse(paginatedSchema(customerResponseSchema), response);
}

export async function restoreCustomer(
  customerId: string,
): Promise<CustomerResourceResponse> {
  const response = await apiClient<CustomerResourceResponse>({
    url: `/customers/${customerId}/restore`,
    method: HttpMethodType.POST,
    errorMessage: "Erro ao restaurar cliente.",
  });

  return parseApiResponse(resourceSchema(customerResponseSchema), response);
}

export async function updateCustomer(
  customerId: string,
  payload: UpdateCustomerPayload,
): Promise<CustomerResourceResponse> {
  const response = await apiClient<CustomerResourceResponse>({
    url: `/customers/${customerId}`,
    method: HttpMethodType.PATCH,
    body: payload,
    errorMessage: "Erro ao atualizar cliente.",
  });

  return parseApiResponse(resourceSchema(customerResponseSchema), response);
}

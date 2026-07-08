import { MessageResponse } from "@/interfaces/authResponse";
import {
  ClaySupplierResourceResponse,
  CreateClaySupplierPayload,
  ListClaySuppliersParams,
  ListClaySuppliersResponse,
  UpdateClaySupplierPayload,
} from "@/interfaces/claySupplier";
import { apiClient } from "@/lib/api-client";
import { buildListQuery } from "@/lib/listQuery";
import {
  claySupplierResponseSchema,
  paginatedSchema,
  parseApiResponse,
  resourceSchema,
} from "@/lib/responseSchemas";
import { HttpMethodType } from "@/types/httpMethod";

export async function createClaySupplier(
  payload: CreateClaySupplierPayload,
): Promise<ClaySupplierResourceResponse> {
  const response = await apiClient<ClaySupplierResourceResponse>({
    url: "/clay-suppliers",
    method: HttpMethodType.POST,
    body: payload,
    errorMessage: "Erro ao criar fornecedor de argila.",
  });

  return parseApiResponse(resourceSchema(claySupplierResponseSchema), response);
}

export async function deleteClaySupplier(
  claySupplierId: string,
): Promise<MessageResponse> {
  return apiClient<MessageResponse>({
    url: `/clay-suppliers/${claySupplierId}`,
    method: HttpMethodType.DELETE,
    errorMessage: "Erro ao excluir fornecedor de argila.",
  });
}

export async function getClaySupplier(
  claySupplierId: string,
): Promise<ClaySupplierResourceResponse> {
  const response = await apiClient<ClaySupplierResourceResponse>({
    url: `/clay-suppliers/${claySupplierId}`,
    method: HttpMethodType.GET,
    errorMessage: "Erro ao buscar fornecedor de argila.",
  });

  return parseApiResponse(resourceSchema(claySupplierResponseSchema), response);
}

export async function listClaySuppliers(
  params: ListClaySuppliersParams = {},
): Promise<ListClaySuppliersResponse> {
  const response = await apiClient<ListClaySuppliersResponse>({
    url: `/clay-suppliers${buildListQuery(params)}`,
    method: HttpMethodType.GET,
    errorMessage: "Erro ao listar fornecedores de argila.",
  });

  return parseApiResponse(
    paginatedSchema(claySupplierResponseSchema),
    response,
  );
}

export async function restoreClaySupplier(
  claySupplierId: string,
): Promise<ClaySupplierResourceResponse> {
  const response = await apiClient<ClaySupplierResourceResponse>({
    url: `/clay-suppliers/${claySupplierId}/restore`,
    method: HttpMethodType.POST,
    errorMessage: "Erro ao restaurar fornecedor de argila.",
  });

  return parseApiResponse(resourceSchema(claySupplierResponseSchema), response);
}

export async function updateClaySupplier(
  claySupplierId: string,
  payload: UpdateClaySupplierPayload,
): Promise<ClaySupplierResourceResponse> {
  const response = await apiClient<ClaySupplierResourceResponse>({
    url: `/clay-suppliers/${claySupplierId}`,
    method: HttpMethodType.PATCH,
    body: payload,
    errorMessage: "Erro ao atualizar fornecedor de argila.",
  });

  return parseApiResponse(resourceSchema(claySupplierResponseSchema), response);
}

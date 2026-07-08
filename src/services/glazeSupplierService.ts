import { MessageResponse } from "@/interfaces/authResponse";
import {
  CreateGlazeSupplierPayload,
  GlazeSupplierResourceResponse,
  ListGlazeSuppliersParams,
  ListGlazeSuppliersResponse,
  UpdateGlazeSupplierPayload,
} from "@/interfaces/glazeSupplier";
import { apiClient } from "@/lib/api-client";
import { buildListQuery } from "@/lib/listQuery";
import {
  glazeSupplierResponseSchema,
  paginatedSchema,
  parseApiResponse,
  resourceSchema,
} from "@/lib/responseSchemas";
import { HttpMethodType } from "@/types/httpMethod";

export async function createGlazeSupplier(
  payload: CreateGlazeSupplierPayload,
): Promise<GlazeSupplierResourceResponse> {
  const response = await apiClient<GlazeSupplierResourceResponse>({
    url: "/glaze-suppliers",
    method: HttpMethodType.POST,
    body: payload,
    errorMessage: "Erro ao criar fornecedor de esmalte.",
  });

  return parseApiResponse(
    resourceSchema(glazeSupplierResponseSchema),
    response,
  );
}

export async function deleteGlazeSupplier(
  glazeSupplierId: string,
): Promise<MessageResponse> {
  return apiClient<MessageResponse>({
    url: `/glaze-suppliers/${glazeSupplierId}`,
    method: HttpMethodType.DELETE,
    errorMessage: "Erro ao excluir fornecedor de esmalte.",
  });
}

export async function getGlazeSupplier(
  glazeSupplierId: string,
): Promise<GlazeSupplierResourceResponse> {
  const response = await apiClient<GlazeSupplierResourceResponse>({
    url: `/glaze-suppliers/${glazeSupplierId}`,
    method: HttpMethodType.GET,
    errorMessage: "Erro ao buscar fornecedor de esmalte.",
  });

  return parseApiResponse(
    resourceSchema(glazeSupplierResponseSchema),
    response,
  );
}

export async function listGlazeSuppliers(
  params: ListGlazeSuppliersParams = {},
): Promise<ListGlazeSuppliersResponse> {
  const response = await apiClient<ListGlazeSuppliersResponse>({
    url: `/glaze-suppliers${buildListQuery(params)}`,
    method: HttpMethodType.GET,
    errorMessage: "Erro ao listar fornecedores de esmalte.",
  });

  return parseApiResponse(
    paginatedSchema(glazeSupplierResponseSchema),
    response,
  );
}

export async function restoreGlazeSupplier(
  glazeSupplierId: string,
): Promise<GlazeSupplierResourceResponse> {
  const response = await apiClient<GlazeSupplierResourceResponse>({
    url: `/glaze-suppliers/${glazeSupplierId}/restore`,
    method: HttpMethodType.POST,
    errorMessage: "Erro ao restaurar fornecedor de esmalte.",
  });

  return parseApiResponse(
    resourceSchema(glazeSupplierResponseSchema),
    response,
  );
}

export async function updateGlazeSupplier(
  glazeSupplierId: string,
  payload: UpdateGlazeSupplierPayload,
): Promise<GlazeSupplierResourceResponse> {
  const response = await apiClient<GlazeSupplierResourceResponse>({
    url: `/glaze-suppliers/${glazeSupplierId}`,
    method: HttpMethodType.PATCH,
    body: payload,
    errorMessage: "Erro ao atualizar fornecedor de esmalte.",
  });

  return parseApiResponse(
    resourceSchema(glazeSupplierResponseSchema),
    response,
  );
}

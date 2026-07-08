import { MessageResponse } from "@/interfaces/authResponse";
import {
  CreateMaterialPurchasePayload,
  ListMaterialPurchasesParams,
  ListMaterialPurchasesResponse,
  MaterialPurchaseResourceResponse,
  UpdateMaterialPurchasePayload,
} from "@/interfaces/materialPurchase";
import { apiClient } from "@/lib/api-client";
import { buildListQuery } from "@/lib/listQuery";
import {
  materialPurchaseResponseSchema,
  paginatedSchema,
  parseApiResponse,
  resourceSchema,
} from "@/lib/responseSchemas";
import { HttpMethodType } from "@/types/httpMethod";

export async function createMaterialPurchase(
  payload: CreateMaterialPurchasePayload,
): Promise<MaterialPurchaseResourceResponse> {
  const response = await apiClient<MaterialPurchaseResourceResponse>({
    url: "/material-purchases",
    method: HttpMethodType.POST,
    body: payload,
    errorMessage: "Erro ao criar compra de material.",
  });

  return parseApiResponse(
    resourceSchema(materialPurchaseResponseSchema),
    response,
  );
}

export async function deleteMaterialPurchase(
  materialPurchaseId: string,
): Promise<MessageResponse> {
  return apiClient<MessageResponse>({
    url: `/material-purchases/${materialPurchaseId}`,
    method: HttpMethodType.DELETE,
    errorMessage: "Erro ao excluir compra de material.",
  });
}

export async function getMaterialPurchase(
  materialPurchaseId: string,
): Promise<MaterialPurchaseResourceResponse> {
  const response = await apiClient<MaterialPurchaseResourceResponse>({
    url: `/material-purchases/${materialPurchaseId}`,
    method: HttpMethodType.GET,
    errorMessage: "Erro ao buscar compra de material.",
  });

  return parseApiResponse(
    resourceSchema(materialPurchaseResponseSchema),
    response,
  );
}

export async function listMaterialPurchases(
  params: ListMaterialPurchasesParams = {},
): Promise<ListMaterialPurchasesResponse> {
  const response = await apiClient<ListMaterialPurchasesResponse>({
    url: `/material-purchases${buildListQuery(params)}`,
    method: HttpMethodType.GET,
    errorMessage: "Erro ao listar compras de material.",
  });

  return parseApiResponse(
    paginatedSchema(materialPurchaseResponseSchema),
    response,
  );
}

export async function restoreMaterialPurchase(
  materialPurchaseId: string,
): Promise<MaterialPurchaseResourceResponse> {
  const response = await apiClient<MaterialPurchaseResourceResponse>({
    url: `/material-purchases/${materialPurchaseId}/restore`,
    method: HttpMethodType.POST,
    errorMessage: "Erro ao restaurar compra de material.",
  });

  return parseApiResponse(
    resourceSchema(materialPurchaseResponseSchema),
    response,
  );
}

export async function updateMaterialPurchase(
  materialPurchaseId: string,
  payload: UpdateMaterialPurchasePayload,
): Promise<MaterialPurchaseResourceResponse> {
  const response = await apiClient<MaterialPurchaseResourceResponse>({
    url: `/material-purchases/${materialPurchaseId}`,
    method: HttpMethodType.PATCH,
    body: payload,
    errorMessage: "Erro ao atualizar compra de material.",
  });

  return parseApiResponse(
    resourceSchema(materialPurchaseResponseSchema),
    response,
  );
}

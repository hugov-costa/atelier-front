import { MessageResponse } from "@/interfaces/authResponse";
import {
  CreatePieceCategoryPayload,
  ListPieceCategoriesParams,
  ListPieceCategoriesResponse,
  PieceCategoryResourceResponse,
  UpdatePieceCategoryPayload,
} from "@/interfaces/pieceCategory";
import { apiClient } from "@/lib/api-client";
import { buildListQuery } from "@/lib/listQuery";
import {
  paginatedSchema,
  parseApiResponse,
  pieceCategoryResponseSchema,
  resourceSchema,
} from "@/lib/responseSchemas";
import { HttpMethodType } from "@/types/httpMethod";

export async function createPieceCategory(
  payload: CreatePieceCategoryPayload,
): Promise<PieceCategoryResourceResponse> {
  const response = await apiClient<PieceCategoryResourceResponse>({
    url: "/piece-categories",
    method: HttpMethodType.POST,
    body: payload,
    errorMessage: "Erro ao criar categoria de peça.",
  });

  return parseApiResponse(
    resourceSchema(pieceCategoryResponseSchema),
    response,
  );
}

export async function deletePieceCategory(
  pieceCategoryId: string,
): Promise<MessageResponse> {
  return apiClient<MessageResponse>({
    url: `/piece-categories/${pieceCategoryId}`,
    method: HttpMethodType.DELETE,
    errorMessage: "Erro ao excluir categoria de peça.",
  });
}

export async function getPieceCategory(
  pieceCategoryId: string,
): Promise<PieceCategoryResourceResponse> {
  const response = await apiClient<PieceCategoryResourceResponse>({
    url: `/piece-categories/${pieceCategoryId}`,
    method: HttpMethodType.GET,
    errorMessage: "Erro ao buscar categoria de peça.",
  });

  return parseApiResponse(
    resourceSchema(pieceCategoryResponseSchema),
    response,
  );
}

export async function listPieceCategories(
  params: ListPieceCategoriesParams = {},
): Promise<ListPieceCategoriesResponse> {
  const response = await apiClient<ListPieceCategoriesResponse>({
    url: `/piece-categories${buildListQuery(params)}`,
    method: HttpMethodType.GET,
    errorMessage: "Erro ao listar categorias de peça.",
  });

  return parseApiResponse(
    paginatedSchema(pieceCategoryResponseSchema),
    response,
  );
}

export async function restorePieceCategory(
  pieceCategoryId: string,
): Promise<PieceCategoryResourceResponse> {
  const response = await apiClient<PieceCategoryResourceResponse>({
    url: `/piece-categories/${pieceCategoryId}/restore`,
    method: HttpMethodType.POST,
    errorMessage: "Erro ao restaurar categoria de peça.",
  });

  return parseApiResponse(
    resourceSchema(pieceCategoryResponseSchema),
    response,
  );
}

export async function updatePieceCategory(
  pieceCategoryId: string,
  payload: UpdatePieceCategoryPayload,
): Promise<PieceCategoryResourceResponse> {
  const response = await apiClient<PieceCategoryResourceResponse>({
    url: `/piece-categories/${pieceCategoryId}`,
    method: HttpMethodType.PATCH,
    body: payload,
    errorMessage: "Erro ao atualizar categoria de peça.",
  });

  return parseApiResponse(
    resourceSchema(pieceCategoryResponseSchema),
    response,
  );
}

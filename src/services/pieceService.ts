import { MessageResponse } from "@/interfaces/authResponse";
import {
  CreatePiecePayload,
  ListPiecesParams,
  ListPiecesResponse,
  PieceResourceResponse,
  UpdatePiecePayload,
} from "@/interfaces/piece";
import { apiClient } from "@/lib/api-client";
import { buildListQuery } from "@/lib/listQuery";
import {
  paginatedSchema,
  parseApiResponse,
  pieceResponseSchema,
  resourceSchema,
} from "@/lib/responseSchemas";
import { HttpMethodType } from "@/types/httpMethod";

export async function createPiece(
  payload: CreatePiecePayload,
): Promise<PieceResourceResponse> {
  const response = await apiClient<PieceResourceResponse>({
    url: "/pieces",
    method: HttpMethodType.POST,
    body: payload,
    errorMessage: "Erro ao criar peça.",
  });

  return parseApiResponse(resourceSchema(pieceResponseSchema), response);
}

export async function deletePiece(pieceId: string): Promise<MessageResponse> {
  return apiClient<MessageResponse>({
    url: `/pieces/${pieceId}`,
    method: HttpMethodType.DELETE,
    errorMessage: "Erro ao excluir peça.",
  });
}

export async function getPiece(
  pieceId: string,
): Promise<PieceResourceResponse> {
  const response = await apiClient<PieceResourceResponse>({
    url: `/pieces/${pieceId}`,
    method: HttpMethodType.GET,
    errorMessage: "Erro ao buscar peça.",
  });

  return parseApiResponse(resourceSchema(pieceResponseSchema), response);
}

export async function listPieces(
  params: ListPiecesParams = {},
): Promise<ListPiecesResponse> {
  const response = await apiClient<ListPiecesResponse>({
    url: `/pieces${buildListQuery(params)}`,
    method: HttpMethodType.GET,
    errorMessage: "Erro ao listar peças.",
  });

  return parseApiResponse(paginatedSchema(pieceResponseSchema), response);
}

export async function restorePiece(
  pieceId: string,
): Promise<PieceResourceResponse> {
  const response = await apiClient<PieceResourceResponse>({
    url: `/pieces/${pieceId}/restore`,
    method: HttpMethodType.POST,
    errorMessage: "Erro ao restaurar peça.",
  });

  return parseApiResponse(resourceSchema(pieceResponseSchema), response);
}

export async function updatePiece(
  pieceId: string,
  payload: UpdatePiecePayload,
): Promise<PieceResourceResponse> {
  const response = await apiClient<PieceResourceResponse>({
    url: `/pieces/${pieceId}`,
    method: HttpMethodType.PATCH,
    body: payload,
    errorMessage: "Erro ao atualizar peça.",
  });

  return parseApiResponse(resourceSchema(pieceResponseSchema), response);
}

import {
  ListPieceChargesParams,
  ListPieceChargesResponse,
  PieceChargeResourceResponse,
  UpdatePieceChargePayload,
} from "@/interfaces/pieceCharge";
import { apiClient } from "@/lib/api-client";
import { buildListQuery } from "@/lib/listQuery";
import {
  paginatedSchema,
  parseApiResponse,
  pieceChargeResponseSchema,
  resourceSchema,
} from "@/lib/responseSchemas";
import { HttpMethodType } from "@/types/httpMethod";

export async function getPieceCharge(
  pieceChargeId: string,
): Promise<PieceChargeResourceResponse> {
  const response = await apiClient<PieceChargeResourceResponse>({
    url: `/piece-charges/${pieceChargeId}`,
    method: HttpMethodType.GET,
    errorMessage: "Erro ao buscar cobrança.",
  });

  return parseApiResponse(resourceSchema(pieceChargeResponseSchema), response);
}

export async function listPieceCharges(
  params: ListPieceChargesParams = {},
): Promise<ListPieceChargesResponse> {
  const response = await apiClient<ListPieceChargesResponse>({
    url: `/piece-charges${buildListQuery(params)}`,
    method: HttpMethodType.GET,
    errorMessage: "Erro ao listar cobranças.",
  });

  return parseApiResponse(paginatedSchema(pieceChargeResponseSchema), response);
}

export async function updatePieceCharge(
  pieceChargeId: string,
  payload: UpdatePieceChargePayload,
): Promise<PieceChargeResourceResponse> {
  const response = await apiClient<PieceChargeResourceResponse>({
    url: `/piece-charges/${pieceChargeId}`,
    method: HttpMethodType.PATCH,
    body: payload,
    errorMessage: "Erro ao atualizar cobrança.",
  });

  return parseApiResponse(resourceSchema(pieceChargeResponseSchema), response);
}

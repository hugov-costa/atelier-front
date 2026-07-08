import { z } from "zod";

import { ResourceResponse } from "@/interfaces/authResponse";
import { PaginatedResponse } from "@/interfaces/paginatedResponse";
import { ListParams } from "@/lib/listQuery";
import { pieceChargeResponseSchema } from "@/lib/responseSchemas";

export type PieceCharge = z.infer<typeof pieceChargeResponseSchema>;

export type ListPieceChargesResponse = PaginatedResponse<PieceCharge>;

export type PieceChargeResourceResponse = ResourceResponse<PieceCharge>;

export type ListPieceChargesParams = Pick<ListParams, "page" | "perPage"> & {
  status?: "paid" | "unpaid";
  user_id?: string;
};

export interface UpdatePieceChargePayload {
  is_paid: boolean;
}

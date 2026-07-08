import { z } from "zod";

import { ResourceResponse } from "@/interfaces/authResponse";
import { PaginatedResponse } from "@/interfaces/paginatedResponse";
import { PieceKind } from "@/lib/enums";
import { ListParams } from "@/lib/listQuery";
import { pieceResponseSchema } from "@/lib/responseSchemas";

export type Piece = z.infer<typeof pieceResponseSchema>;

export type ListPiecesResponse = PaginatedResponse<Piece>;

export type PieceResourceResponse = ResourceResponse<Piece>;

export type ListPiecesParams = Pick<ListParams, "page" | "perPage">;

export interface CreatePiecePayload {
  clay_amount: number;
  clay_id: string;
  firing_cycle_ids?: string[];
  glaze_amount?: number | null;
  glaze_id?: string | null;
  kind: PieceKind;
  name: string;
  piece_category_id?: string | null;
  user_id: string;
}

export interface UpdatePiecePayload {
  name?: string;
}

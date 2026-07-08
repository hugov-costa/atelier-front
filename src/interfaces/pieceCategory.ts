import { z } from "zod";

import { ResourceResponse } from "@/interfaces/authResponse";
import { PaginatedResponse } from "@/interfaces/paginatedResponse";
import { ListParams } from "@/lib/listQuery";
import { pieceCategoryResponseSchema } from "@/lib/responseSchemas";

export type PieceCategory = z.infer<typeof pieceCategoryResponseSchema>;

export type ListPieceCategoriesResponse = PaginatedResponse<PieceCategory>;

export type PieceCategoryResourceResponse = ResourceResponse<PieceCategory>;

export type ListPieceCategoriesParams = Pick<ListParams, "page" | "perPage">;

export interface CreatePieceCategoryPayload {
  available_until?: string | null;
  name: string;
  profit_margin: number;
}

export type UpdatePieceCategoryPayload = Partial<CreatePieceCategoryPayload>;

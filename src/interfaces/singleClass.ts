import { z } from "zod";

import { ResourceResponse } from "@/interfaces/authResponse";
import { PaginatedResponse } from "@/interfaces/paginatedResponse";
import { ListParams } from "@/lib/listQuery";
import { singleClassResponseSchema } from "@/lib/responseSchemas";

export type SingleClass = z.infer<typeof singleClassResponseSchema>;

export type ListSingleClassesResponse = PaginatedResponse<SingleClass>;

export type SingleClassResourceResponse = ResourceResponse<SingleClass>;

export type ListSingleClassesParams = Pick<ListParams, "page" | "perPage">;

export interface CreateSingleClassPayload {
  end_datetime: string;
  is_replacement: boolean;
  price?: number | null;
  start_datetime: string;
  user_ids: string[];
}

export interface UpdateSingleClassPayload {
  end_datetime?: string;
  is_replacement?: boolean;
  price?: number | null;
  start_datetime?: string;
  user_ids?: string[];
}

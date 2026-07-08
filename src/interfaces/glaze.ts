import { z } from "zod";

import { ResourceResponse } from "@/interfaces/authResponse";
import { PaginatedResponse } from "@/interfaces/paginatedResponse";
import { ListParams } from "@/lib/listQuery";
import { glazeResponseSchema } from "@/lib/responseSchemas";

export type Glaze = z.infer<typeof glazeResponseSchema>;

export type ListGlazesResponse = PaginatedResponse<Glaze>;

export type GlazeResourceResponse = ResourceResponse<Glaze>;

export type ListGlazesParams = Pick<ListParams, "page" | "perPage">;

export interface CreateGlazePayload {
  description?: string | null;
  glaze_supplier_id: string;
  name: string;
  price: number;
}

export type UpdateGlazePayload = Partial<CreateGlazePayload>;

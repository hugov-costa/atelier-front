import { z } from "zod";

import { ResourceResponse } from "@/interfaces/authResponse";
import { PaginatedResponse } from "@/interfaces/paginatedResponse";
import { ListParams } from "@/lib/listQuery";
import { clayResponseSchema } from "@/lib/responseSchemas";

export type Clay = z.infer<typeof clayResponseSchema>;

export type ListClaysResponse = PaginatedResponse<Clay>;

export type ClayResourceResponse = ResourceResponse<Clay>;

export type ListClaysParams = Pick<ListParams, "page" | "perPage">;

export interface CreateClayPayload {
  clay_supplier_id: string;
  description?: string | null;
  name: string;
  price: number;
}

export type UpdateClayPayload = Partial<CreateClayPayload>;

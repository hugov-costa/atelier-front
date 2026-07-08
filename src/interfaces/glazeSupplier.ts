import { z } from "zod";

import { ResourceResponse } from "@/interfaces/authResponse";
import { PaginatedResponse } from "@/interfaces/paginatedResponse";
import { ListParams } from "@/lib/listQuery";
import { glazeSupplierResponseSchema } from "@/lib/responseSchemas";

export type GlazeSupplier = z.infer<typeof glazeSupplierResponseSchema>;

export type ListGlazeSuppliersResponse = PaginatedResponse<GlazeSupplier>;

export type GlazeSupplierResourceResponse = ResourceResponse<GlazeSupplier>;

export type ListGlazeSuppliersParams = Pick<ListParams, "page" | "perPage">;

export interface CreateGlazeSupplierPayload {
  email: string;
  name: string;
  phone: string;
}

export type UpdateGlazeSupplierPayload = Partial<CreateGlazeSupplierPayload>;

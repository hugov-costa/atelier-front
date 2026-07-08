import { z } from "zod";

import { ResourceResponse } from "@/interfaces/authResponse";
import { PaginatedResponse } from "@/interfaces/paginatedResponse";
import { ListParams } from "@/lib/listQuery";
import { claySupplierResponseSchema } from "@/lib/responseSchemas";

export type ClaySupplier = z.infer<typeof claySupplierResponseSchema>;

export type ListClaySuppliersResponse = PaginatedResponse<ClaySupplier>;

export type ClaySupplierResourceResponse = ResourceResponse<ClaySupplier>;

export type ListClaySuppliersParams = Pick<ListParams, "page" | "perPage">;

export interface CreateClaySupplierPayload {
  email: string;
  name: string;
  phone: string;
}

export type UpdateClaySupplierPayload = Partial<CreateClaySupplierPayload>;

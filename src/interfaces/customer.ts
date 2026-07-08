import { z } from "zod";

import { ResourceResponse } from "@/interfaces/authResponse";
import { PaginatedResponse } from "@/interfaces/paginatedResponse";
import { ListParams } from "@/lib/listQuery";
import { customerResponseSchema } from "@/lib/responseSchemas";

export type Customer = z.infer<typeof customerResponseSchema>;

export type ListCustomersResponse = PaginatedResponse<Customer>;

export type CustomerResourceResponse = ResourceResponse<Customer>;

export type ListCustomersParams = Pick<ListParams, "page" | "perPage">;

export interface CreateCustomerPayload {
  description?: string | null;
  email?: string | null;
  name: string;
  phone?: string | null;
}

export type UpdateCustomerPayload = Partial<CreateCustomerPayload>;

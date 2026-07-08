import { z } from "zod";

import { PaginatedResponse } from "@/interfaces/paginatedResponse";
import { auditResponseSchema } from "@/lib/responseSchemas";

export type AuditEvent = z.infer<typeof auditResponseSchema>["event"];

export type Audit = z.infer<typeof auditResponseSchema>;

export type ListAuditsResponse = PaginatedResponse<Audit>;

export interface AuditFilterParams {
  event?: AuditEvent;
  ip_address?: string;
  from?: string;
  to?: string;
  page?: number;
  perPage?: number;
}

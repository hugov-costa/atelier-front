import { PaginatedResponse } from "@/interfaces/paginatedResponse";

export type AuditEvent = "created" | "updated" | "deleted" | "restored";

export interface Audit {
  id: number;
  event: AuditEvent;
  auditable_type: string;
  auditable_id: string;
  user_id: string | null;
  old_values: Record<string, unknown>;
  new_values: Record<string, unknown>;
  ip_address: string | null;
  url: string | null;
  created_at: string;
}

export type ListAuditsResponse = PaginatedResponse<Audit>;

export interface AuditFilterParams {
  event?: AuditEvent;
  ip_address?: string;
  from?: string;
  to?: string;
  page?: number;
  perPage?: number;
}

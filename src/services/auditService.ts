import { AuditFilterParams, ListAuditsResponse } from "@/interfaces/audit";
import { apiClient } from "@/lib/api-client";
import {
  auditResponseSchema,
  paginatedSchema,
  parseApiResponse,
} from "@/lib/responseSchemas";
import { HttpMethodType } from "@/types/httpMethod";

export function buildAuditQuery(params: AuditFilterParams): string {
  const searchParams = new URLSearchParams();

  if (params.event) {
    searchParams.set("event", params.event);
  }

  if (params.ip_address) {
    searchParams.set("ip_address", params.ip_address);
  }

  if (params.from) {
    searchParams.set("from", params.from);
  }

  if (params.to) {
    searchParams.set("to", params.to);
  }

  if (params.page !== undefined) {
    searchParams.set("page", String(params.page));
  }

  if (params.perPage !== undefined) {
    searchParams.set("per_page", String(params.perPage));
  }

  const query = searchParams.toString();

  return query ? `?${query}` : "";
}

export async function listAudits(
  params: AuditFilterParams = {},
): Promise<ListAuditsResponse> {
  const response = await apiClient<ListAuditsResponse>({
    url: `/users/audits${buildAuditQuery(params)}`,
    method: HttpMethodType.GET,
    errorMessage: "Erro ao carregar a auditoria.",
  });

  return parseApiResponse(paginatedSchema(auditResponseSchema), response);
}

export async function listUserAudits(
  userId: string,
  params: AuditFilterParams = {},
): Promise<ListAuditsResponse> {
  const response = await apiClient<ListAuditsResponse>({
    url: `/users/${userId}/audits${buildAuditQuery(params)}`,
    method: HttpMethodType.GET,
    errorMessage: "Erro ao carregar a auditoria do usuário.",
  });

  return parseApiResponse(paginatedSchema(auditResponseSchema), response);
}

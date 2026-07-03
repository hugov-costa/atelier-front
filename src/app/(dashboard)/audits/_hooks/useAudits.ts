"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { AuditFilterParams } from "@/interfaces/audit";
import { queryKeys } from "@/lib/queryKeys";
import { listAudits, listUserAudits } from "@/services/auditService";

export function useAudits(params: AuditFilterParams) {
  return useQuery({
    queryKey: queryKeys.audits(params),
    queryFn: () => listAudits(params),
    placeholderData: keepPreviousData,
  });
}

export function useUserAudits(userId: string, params: AuditFilterParams) {
  return useQuery({
    queryKey: queryKeys.userAudits(userId, params),
    queryFn: () => listUserAudits(userId, params),
    enabled: userId.length > 0,
    placeholderData: keepPreviousData,
  });
}

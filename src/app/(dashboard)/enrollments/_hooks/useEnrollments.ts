"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { ListEnrollmentsParams } from "@/interfaces/enrollment";
import { queryKeys } from "@/lib/queryKeys";
import { listEnrollments } from "@/services/enrollmentService";

interface UseEnrollmentsOptions {
  enabled?: boolean;
}

export function useEnrollments(
  params: ListEnrollmentsParams,
  options: UseEnrollmentsOptions = {},
) {
  return useQuery({
    queryKey: queryKeys.enrollmentsList(params),
    queryFn: () => listEnrollments(params),
    placeholderData: keepPreviousData,
    enabled: options.enabled ?? true,
  });
}

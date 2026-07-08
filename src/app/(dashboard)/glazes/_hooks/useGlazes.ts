"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { ListGlazesParams } from "@/interfaces/glaze";
import { queryKeys } from "@/lib/queryKeys";
import { listGlazes } from "@/services/glazeService";

interface UseGlazesOptions {
  enabled?: boolean;
}

export function useGlazes(
  params: ListGlazesParams,
  options: UseGlazesOptions = {},
) {
  return useQuery({
    queryKey: queryKeys.glazesList(params),
    queryFn: () => listGlazes(params),
    placeholderData: keepPreviousData,
    enabled: options.enabled ?? true,
  });
}

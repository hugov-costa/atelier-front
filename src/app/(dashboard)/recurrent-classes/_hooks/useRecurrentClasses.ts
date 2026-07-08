"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { ListRecurrentClassesParams } from "@/interfaces/recurrentClass";
import { queryKeys } from "@/lib/queryKeys";
import { listRecurrentClasses } from "@/services/recurrentClassService";

interface UseRecurrentClassesOptions {
  enabled?: boolean;
}

export function useRecurrentClasses(
  params: ListRecurrentClassesParams,
  options: UseRecurrentClassesOptions = {},
) {
  return useQuery({
    queryKey: queryKeys.recurrentClassesList(params),
    queryFn: () => listRecurrentClasses(params),
    placeholderData: keepPreviousData,
    enabled: options.enabled ?? true,
  });
}

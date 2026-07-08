"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { ListSingleClassesParams } from "@/interfaces/singleClass";
import { queryKeys } from "@/lib/queryKeys";
import { listSingleClasses } from "@/services/singleClassService";

interface UseSingleClassesOptions {
  enabled?: boolean;
}

export function useSingleClasses(
  params: ListSingleClassesParams,
  options: UseSingleClassesOptions = {},
) {
  return useQuery({
    queryKey: queryKeys.singleClassesList(params),
    queryFn: () => listSingleClasses(params),
    placeholderData: keepPreviousData,
    enabled: options.enabled ?? true,
  });
}

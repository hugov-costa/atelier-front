"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { ListClaysParams } from "@/interfaces/clay";
import { queryKeys } from "@/lib/queryKeys";
import { listClays } from "@/services/clayService";

interface UseClaysOptions {
  enabled?: boolean;
}

export function useClays(
  params: ListClaysParams,
  options: UseClaysOptions = {},
) {
  return useQuery({
    queryKey: queryKeys.claysList(params),
    queryFn: () => listClays(params),
    placeholderData: keepPreviousData,
    enabled: options.enabled ?? true,
  });
}

"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { ListFiringCyclesParams } from "@/interfaces/firingCycle";
import { queryKeys } from "@/lib/queryKeys";
import { listFiringCycles } from "@/services/firingCycleService";

interface UseFiringCyclesOptions {
  enabled?: boolean;
}

export function useFiringCycles(
  params: ListFiringCyclesParams,
  options: UseFiringCyclesOptions = {},
) {
  return useQuery({
    queryKey: queryKeys.firingCyclesList(params),
    queryFn: () => listFiringCycles(params),
    placeholderData: keepPreviousData,
    enabled: options.enabled ?? true,
  });
}

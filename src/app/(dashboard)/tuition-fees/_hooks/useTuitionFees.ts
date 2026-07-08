"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { ListTuitionFeesParams } from "@/interfaces/tuitionFee";
import { queryKeys } from "@/lib/queryKeys";
import { listTuitionFees } from "@/services/tuitionFeeService";

interface UseTuitionFeesOptions {
  enabled?: boolean;
}

export function useTuitionFees(
  params: ListTuitionFeesParams,
  options: UseTuitionFeesOptions = {},
) {
  return useQuery({
    queryKey: queryKeys.tuitionFeesList(params),
    queryFn: () => listTuitionFees(params),
    placeholderData: keepPreviousData,
    enabled: options.enabled ?? true,
  });
}

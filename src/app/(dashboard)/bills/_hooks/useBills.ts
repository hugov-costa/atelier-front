"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { ListBillsParams } from "@/interfaces/bill";
import { queryKeys } from "@/lib/queryKeys";
import { listBills } from "@/services/billService";

interface UseBillsOptions {
  enabled?: boolean;
}

export function useBills(
  params: ListBillsParams,
  options: UseBillsOptions = {},
) {
  return useQuery({
    queryKey: queryKeys.billsList(params),
    queryFn: () => listBills(params),
    placeholderData: keepPreviousData,
    enabled: options.enabled ?? true,
  });
}

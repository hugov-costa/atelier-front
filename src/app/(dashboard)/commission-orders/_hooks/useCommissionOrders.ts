"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { ListCommissionOrdersParams } from "@/interfaces/commissionOrder";
import { queryKeys } from "@/lib/queryKeys";
import { listCommissionOrders } from "@/services/commissionOrderService";

interface UseCommissionOrdersOptions {
  enabled?: boolean;
}

export function useCommissionOrders(
  params: ListCommissionOrdersParams,
  options: UseCommissionOrdersOptions = {},
) {
  return useQuery({
    queryKey: queryKeys.commissionOrdersList(params),
    queryFn: () => listCommissionOrders(params),
    placeholderData: keepPreviousData,
    enabled: options.enabled ?? true,
  });
}

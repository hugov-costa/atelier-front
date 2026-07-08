"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { ListCustomersParams } from "@/interfaces/customer";
import { queryKeys } from "@/lib/queryKeys";
import { listCustomers } from "@/services/customerService";

interface UseCustomersOptions {
  enabled?: boolean;
}

export function useCustomers(
  params: ListCustomersParams,
  options: UseCustomersOptions = {},
) {
  return useQuery({
    queryKey: queryKeys.customersList(params),
    queryFn: () => listCustomers(params),
    placeholderData: keepPreviousData,
    enabled: options.enabled ?? true,
  });
}

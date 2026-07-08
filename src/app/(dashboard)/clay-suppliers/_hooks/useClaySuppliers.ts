"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { ListClaySuppliersParams } from "@/interfaces/claySupplier";
import { queryKeys } from "@/lib/queryKeys";
import { listClaySuppliers } from "@/services/claySupplierService";

interface UseClaySuppliersOptions {
  enabled?: boolean;
}

export function useClaySuppliers(
  params: ListClaySuppliersParams,
  options: UseClaySuppliersOptions = {},
) {
  return useQuery({
    queryKey: queryKeys.claySuppliersList(params),
    queryFn: () => listClaySuppliers(params),
    placeholderData: keepPreviousData,
    enabled: options.enabled ?? true,
  });
}

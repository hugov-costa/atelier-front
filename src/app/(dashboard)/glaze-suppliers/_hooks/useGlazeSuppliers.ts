"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { ListGlazeSuppliersParams } from "@/interfaces/glazeSupplier";
import { queryKeys } from "@/lib/queryKeys";
import { listGlazeSuppliers } from "@/services/glazeSupplierService";

interface UseGlazeSuppliersOptions {
  enabled?: boolean;
}

export function useGlazeSuppliers(
  params: ListGlazeSuppliersParams,
  options: UseGlazeSuppliersOptions = {},
) {
  return useQuery({
    queryKey: queryKeys.glazeSuppliersList(params),
    queryFn: () => listGlazeSuppliers(params),
    placeholderData: keepPreviousData,
    enabled: options.enabled ?? true,
  });
}

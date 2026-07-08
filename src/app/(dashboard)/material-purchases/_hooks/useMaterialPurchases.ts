"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { ListMaterialPurchasesParams } from "@/interfaces/materialPurchase";
import { queryKeys } from "@/lib/queryKeys";
import { listMaterialPurchases } from "@/services/materialPurchaseService";

interface UseMaterialPurchasesOptions {
  enabled?: boolean;
}

export function useMaterialPurchases(
  params: ListMaterialPurchasesParams,
  options: UseMaterialPurchasesOptions = {},
) {
  return useQuery({
    queryKey: queryKeys.materialPurchasesList(params),
    queryFn: () => listMaterialPurchases(params),
    placeholderData: keepPreviousData,
    enabled: options.enabled ?? true,
  });
}

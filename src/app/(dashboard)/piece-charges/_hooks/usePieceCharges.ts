"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { ListPieceChargesParams } from "@/interfaces/pieceCharge";
import { queryKeys } from "@/lib/queryKeys";
import { listPieceCharges } from "@/services/pieceChargeService";

interface UsePieceChargesOptions {
  enabled?: boolean;
}

export function usePieceCharges(
  params: ListPieceChargesParams,
  options: UsePieceChargesOptions = {},
) {
  return useQuery({
    queryKey: queryKeys.pieceChargesList(params),
    queryFn: () => listPieceCharges(params),
    placeholderData: keepPreviousData,
    enabled: options.enabled ?? true,
  });
}

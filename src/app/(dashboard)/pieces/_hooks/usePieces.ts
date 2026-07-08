"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { ListPiecesParams } from "@/interfaces/piece";
import { queryKeys } from "@/lib/queryKeys";
import { listPieces } from "@/services/pieceService";

interface UsePiecesOptions {
  enabled?: boolean;
}

export function usePieces(
  params: ListPiecesParams,
  options: UsePiecesOptions = {},
) {
  return useQuery({
    queryKey: queryKeys.piecesList(params),
    queryFn: () => listPieces(params),
    placeholderData: keepPreviousData,
    enabled: options.enabled ?? true,
  });
}

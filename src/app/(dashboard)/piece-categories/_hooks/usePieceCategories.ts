"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { ListPieceCategoriesParams } from "@/interfaces/pieceCategory";
import { queryKeys } from "@/lib/queryKeys";
import { listPieceCategories } from "@/services/pieceCategoryService";

interface UsePieceCategoriesOptions {
  enabled?: boolean;
}

export function usePieceCategories(
  params: ListPieceCategoriesParams,
  options: UsePieceCategoriesOptions = {},
) {
  return useQuery({
    queryKey: queryKeys.pieceCategoriesList(params),
    queryFn: () => listPieceCategories(params),
    placeholderData: keepPreviousData,
    enabled: options.enabled ?? true,
  });
}

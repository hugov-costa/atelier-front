import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import {
  PIECE_CATEGORIES_INITIAL_PARAMS,
  PieceCategoriesView,
} from "@/app/(dashboard)/piece-categories/_components/piece-categories-view";
import { queryKeys } from "@/lib/queryKeys";
import { fetchPieceCategoriesOnServer } from "@/lib/server-prefetch";
import { makeServerQueryClient } from "@/lib/server-query";

export default async function PieceCategoriesPage() {
  const queryClient = makeServerQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.pieceCategoriesList(PIECE_CATEGORIES_INITIAL_PARAMS),
    queryFn: () =>
      fetchPieceCategoriesOnServer(PIECE_CATEGORIES_INITIAL_PARAMS),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PieceCategoriesView />
    </HydrationBoundary>
  );
}

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import {
  PIECES_INITIAL_PARAMS,
  PiecesView,
} from "@/app/(dashboard)/pieces/_components/pieces-view";
import { queryKeys } from "@/lib/queryKeys";
import { fetchPiecesOnServer } from "@/lib/server-prefetch";
import { makeServerQueryClient } from "@/lib/server-query";

export default async function PiecesPage() {
  const queryClient = makeServerQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.piecesList(PIECES_INITIAL_PARAMS),
    queryFn: () => fetchPiecesOnServer(PIECES_INITIAL_PARAMS),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PiecesView />
    </HydrationBoundary>
  );
}

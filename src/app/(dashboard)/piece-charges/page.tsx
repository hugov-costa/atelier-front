import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import {
  PIECE_CHARGES_INITIAL_PARAMS,
  PieceChargesView,
} from "@/app/(dashboard)/piece-charges/_components/piece-charges-view";
import { queryKeys } from "@/lib/queryKeys";
import { fetchPieceChargesOnServer } from "@/lib/server-prefetch";
import { makeServerQueryClient } from "@/lib/server-query";

export default async function PieceChargesPage() {
  const queryClient = makeServerQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.pieceChargesList(PIECE_CHARGES_INITIAL_PARAMS),
    queryFn: () => fetchPieceChargesOnServer(PIECE_CHARGES_INITIAL_PARAMS),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PieceChargesView />
    </HydrationBoundary>
  );
}

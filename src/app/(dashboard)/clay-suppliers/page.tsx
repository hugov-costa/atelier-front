import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import {
  CLAY_SUPPLIERS_INITIAL_PARAMS,
  ClaySuppliersView,
} from "@/app/(dashboard)/clay-suppliers/_components/clay-suppliers-view";
import { queryKeys } from "@/lib/queryKeys";
import { fetchClaySuppliersOnServer } from "@/lib/server-prefetch";
import { makeServerQueryClient } from "@/lib/server-query";

export default async function ClaySuppliersPage() {
  const queryClient = makeServerQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.claySuppliersList(CLAY_SUPPLIERS_INITIAL_PARAMS),
    queryFn: () => fetchClaySuppliersOnServer(CLAY_SUPPLIERS_INITIAL_PARAMS),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClaySuppliersView />
    </HydrationBoundary>
  );
}

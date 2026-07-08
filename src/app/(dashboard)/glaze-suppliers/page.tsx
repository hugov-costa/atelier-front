import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import {
  GLAZE_SUPPLIERS_INITIAL_PARAMS,
  GlazeSuppliersView,
} from "@/app/(dashboard)/glaze-suppliers/_components/glaze-suppliers-view";
import { queryKeys } from "@/lib/queryKeys";
import { fetchGlazeSuppliersOnServer } from "@/lib/server-prefetch";
import { makeServerQueryClient } from "@/lib/server-query";

export default async function GlazeSuppliersPage() {
  const queryClient = makeServerQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.glazeSuppliersList(GLAZE_SUPPLIERS_INITIAL_PARAMS),
    queryFn: () => fetchGlazeSuppliersOnServer(GLAZE_SUPPLIERS_INITIAL_PARAMS),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <GlazeSuppliersView />
    </HydrationBoundary>
  );
}

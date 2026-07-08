import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import {
  MATERIAL_PURCHASES_INITIAL_PARAMS,
  MaterialPurchasesView,
} from "@/app/(dashboard)/material-purchases/_components/material-purchases-view";
import { queryKeys } from "@/lib/queryKeys";
import { fetchMaterialPurchasesOnServer } from "@/lib/server-prefetch";
import { makeServerQueryClient } from "@/lib/server-query";

export default async function MaterialPurchasesPage() {
  const queryClient = makeServerQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.materialPurchasesList(
      MATERIAL_PURCHASES_INITIAL_PARAMS,
    ),
    queryFn: () =>
      fetchMaterialPurchasesOnServer(MATERIAL_PURCHASES_INITIAL_PARAMS),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MaterialPurchasesView />
    </HydrationBoundary>
  );
}

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import {
  COMMISSION_ORDERS_INITIAL_PARAMS,
  CommissionOrdersView,
} from "@/app/(dashboard)/commission-orders/_components/commission-orders-view";
import { queryKeys } from "@/lib/queryKeys";
import { fetchCommissionOrdersOnServer } from "@/lib/server-prefetch";
import { makeServerQueryClient } from "@/lib/server-query";

export default async function CommissionOrdersPage() {
  const queryClient = makeServerQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.commissionOrdersList(COMMISSION_ORDERS_INITIAL_PARAMS),
    queryFn: () =>
      fetchCommissionOrdersOnServer(COMMISSION_ORDERS_INITIAL_PARAMS),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CommissionOrdersView />
    </HydrationBoundary>
  );
}

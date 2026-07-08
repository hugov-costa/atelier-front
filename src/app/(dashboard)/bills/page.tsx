import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import {
  BILLS_INITIAL_PARAMS,
  BillsView,
} from "@/app/(dashboard)/bills/_components/bills-view";
import { queryKeys } from "@/lib/queryKeys";
import { fetchBillsOnServer } from "@/lib/server-prefetch";
import { makeServerQueryClient } from "@/lib/server-query";

export default async function BillsPage() {
  const queryClient = makeServerQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.billsList(BILLS_INITIAL_PARAMS),
    queryFn: () => fetchBillsOnServer(BILLS_INITIAL_PARAMS),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BillsView />
    </HydrationBoundary>
  );
}

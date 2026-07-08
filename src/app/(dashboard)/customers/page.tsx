import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import {
  CUSTOMERS_INITIAL_PARAMS,
  CustomersView,
} from "@/app/(dashboard)/customers/_components/customers-view";
import { queryKeys } from "@/lib/queryKeys";
import { fetchCustomersOnServer } from "@/lib/server-prefetch";
import { makeServerQueryClient } from "@/lib/server-query";

export default async function CustomersPage() {
  const queryClient = makeServerQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.customersList(CUSTOMERS_INITIAL_PARAMS),
    queryFn: () => fetchCustomersOnServer(CUSTOMERS_INITIAL_PARAMS),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CustomersView />
    </HydrationBoundary>
  );
}

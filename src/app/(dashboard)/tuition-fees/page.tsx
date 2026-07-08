import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import {
  TUITION_FEES_INITIAL_PARAMS,
  TuitionFeesView,
} from "@/app/(dashboard)/tuition-fees/_components/tuition-fees-view";
import { queryKeys } from "@/lib/queryKeys";
import { fetchTuitionFeesOnServer } from "@/lib/server-prefetch";
import { makeServerQueryClient } from "@/lib/server-query";

export default async function TuitionFeesPage() {
  const queryClient = makeServerQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.tuitionFeesList(TUITION_FEES_INITIAL_PARAMS),
    queryFn: () => fetchTuitionFeesOnServer(TUITION_FEES_INITIAL_PARAMS),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TuitionFeesView />
    </HydrationBoundary>
  );
}

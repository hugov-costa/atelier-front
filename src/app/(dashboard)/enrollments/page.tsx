import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import {
  ENROLLMENTS_INITIAL_PARAMS,
  EnrollmentsView,
} from "@/app/(dashboard)/enrollments/_components/enrollments-view";
import { queryKeys } from "@/lib/queryKeys";
import { fetchEnrollmentsOnServer } from "@/lib/server-prefetch";
import { makeServerQueryClient } from "@/lib/server-query";

export default async function EnrollmentsPage() {
  const queryClient = makeServerQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.enrollmentsList(ENROLLMENTS_INITIAL_PARAMS),
    queryFn: () => fetchEnrollmentsOnServer(ENROLLMENTS_INITIAL_PARAMS),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EnrollmentsView />
    </HydrationBoundary>
  );
}

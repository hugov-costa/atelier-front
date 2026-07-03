import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import {
  AUDITS_INITIAL_PARAMS,
  AuditsView,
} from "@/app/(dashboard)/audits/_components/audits-view";
import { queryKeys } from "@/lib/queryKeys";
import { fetchAuditsOnServer } from "@/lib/server-prefetch";
import { makeServerQueryClient } from "@/lib/server-query";

export default async function AuditsPage() {
  const queryClient = makeServerQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.audits(AUDITS_INITIAL_PARAMS),
    queryFn: () => fetchAuditsOnServer(AUDITS_INITIAL_PARAMS),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AuditsView />
    </HydrationBoundary>
  );
}

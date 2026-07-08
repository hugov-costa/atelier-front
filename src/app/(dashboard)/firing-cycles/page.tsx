import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import {
  FIRING_CYCLES_INITIAL_PARAMS,
  FiringCyclesView,
} from "@/app/(dashboard)/firing-cycles/_components/firing-cycles-view";
import { queryKeys } from "@/lib/queryKeys";
import { fetchFiringCyclesOnServer } from "@/lib/server-prefetch";
import { makeServerQueryClient } from "@/lib/server-query";

export default async function FiringCyclesPage() {
  const queryClient = makeServerQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.firingCyclesList(FIRING_CYCLES_INITIAL_PARAMS),
    queryFn: () => fetchFiringCyclesOnServer(FIRING_CYCLES_INITIAL_PARAMS),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FiringCyclesView />
    </HydrationBoundary>
  );
}

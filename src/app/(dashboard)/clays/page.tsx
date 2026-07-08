import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import {
  CLAYS_INITIAL_PARAMS,
  ClaysView,
} from "@/app/(dashboard)/clays/_components/clays-view";
import { queryKeys } from "@/lib/queryKeys";
import { fetchClaysOnServer } from "@/lib/server-prefetch";
import { makeServerQueryClient } from "@/lib/server-query";

export default async function ClaysPage() {
  const queryClient = makeServerQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.claysList(CLAYS_INITIAL_PARAMS),
    queryFn: () => fetchClaysOnServer(CLAYS_INITIAL_PARAMS),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClaysView />
    </HydrationBoundary>
  );
}

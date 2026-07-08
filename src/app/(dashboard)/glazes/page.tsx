import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import {
  GLAZES_INITIAL_PARAMS,
  GlazesView,
} from "@/app/(dashboard)/glazes/_components/glazes-view";
import { queryKeys } from "@/lib/queryKeys";
import { fetchGlazesOnServer } from "@/lib/server-prefetch";
import { makeServerQueryClient } from "@/lib/server-query";

export default async function GlazesPage() {
  const queryClient = makeServerQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.glazesList(GLAZES_INITIAL_PARAMS),
    queryFn: () => fetchGlazesOnServer(GLAZES_INITIAL_PARAMS),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <GlazesView />
    </HydrationBoundary>
  );
}

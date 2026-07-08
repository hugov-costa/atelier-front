import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import {
  SINGLE_CLASSES_INITIAL_PARAMS,
  SingleClassesView,
} from "@/app/(dashboard)/single-classes/_components/single-classes-view";
import { queryKeys } from "@/lib/queryKeys";
import { fetchSingleClassesOnServer } from "@/lib/server-prefetch";
import { makeServerQueryClient } from "@/lib/server-query";

export default async function SingleClassesPage() {
  const queryClient = makeServerQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.singleClassesList(SINGLE_CLASSES_INITIAL_PARAMS),
    queryFn: () => fetchSingleClassesOnServer(SINGLE_CLASSES_INITIAL_PARAMS),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SingleClassesView />
    </HydrationBoundary>
  );
}

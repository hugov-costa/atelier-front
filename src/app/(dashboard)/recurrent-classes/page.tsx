import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import {
  RECURRENT_CLASSES_INITIAL_PARAMS,
  RecurrentClassesView,
} from "@/app/(dashboard)/recurrent-classes/_components/recurrent-classes-view";
import { queryKeys } from "@/lib/queryKeys";
import { fetchRecurrentClassesOnServer } from "@/lib/server-prefetch";
import { makeServerQueryClient } from "@/lib/server-query";

export default async function RecurrentClassesPage() {
  const queryClient = makeServerQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.recurrentClassesList(RECURRENT_CLASSES_INITIAL_PARAMS),
    queryFn: () =>
      fetchRecurrentClassesOnServer(RECURRENT_CLASSES_INITIAL_PARAMS),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RecurrentClassesView />
    </HydrationBoundary>
  );
}

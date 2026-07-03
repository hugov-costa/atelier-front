import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import {
  USERS_INITIAL_PARAMS,
  UsersView,
} from "@/app/(dashboard)/users/_components/users-view";
import { queryKeys } from "@/lib/queryKeys";
import { fetchUsersOnServer } from "@/lib/server-prefetch";
import { makeServerQueryClient } from "@/lib/server-query";

export default async function UsersPage() {
  const queryClient = makeServerQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.usersList(USERS_INITIAL_PARAMS),
    queryFn: () => fetchUsersOnServer(USERS_INITIAL_PARAMS),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UsersView />
    </HydrationBoundary>
  );
}

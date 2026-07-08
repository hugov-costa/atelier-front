import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import {
  NOTIFICATIONS_INITIAL_PARAMS,
  NotificationsView,
} from "@/app/(dashboard)/notifications/_components/notifications-view";
import { queryKeys } from "@/lib/queryKeys";
import { fetchNotificationsOnServer } from "@/lib/server-prefetch";
import { makeServerQueryClient } from "@/lib/server-query";

export default async function NotificationsPage() {
  const queryClient = makeServerQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.notificationsList(NOTIFICATIONS_INITIAL_PARAMS),
    queryFn: () => fetchNotificationsOnServer(NOTIFICATIONS_INITIAL_PARAMS),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotificationsView />
    </HydrationBoundary>
  );
}

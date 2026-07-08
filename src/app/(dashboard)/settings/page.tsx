import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { SettingsView } from "@/app/(dashboard)/settings/_components/settings-view";
import { queryKeys } from "@/lib/queryKeys";
import { fetchSettingsOnServer } from "@/lib/server-prefetch";
import { makeServerQueryClient } from "@/lib/server-query";

export default async function SettingsPage() {
  const queryClient = makeServerQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.settings,
    queryFn: () => fetchSettingsOnServer(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SettingsView />
    </HydrationBoundary>
  );
}

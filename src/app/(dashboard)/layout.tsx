import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ReactNode } from "react";

import { AuthenticatedShell } from "@/components/dashboard/authenticated-shell";
import { queryKeys } from "@/lib/queryKeys";
import { fetchCurrentUserOnServer } from "@/lib/server-prefetch";
import { makeServerQueryClient } from "@/lib/server-query";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const queryClient = makeServerQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.currentUser,
    queryFn: fetchCurrentUserOnServer,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AuthenticatedShell>{children}</AuthenticatedShell>
    </HydrationBoundary>
  );
}

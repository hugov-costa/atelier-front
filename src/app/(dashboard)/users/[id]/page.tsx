import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { EditUserView } from "@/app/(dashboard)/users/_components/edit-user-view";
import { queryKeys } from "@/lib/queryKeys";
import { fetchUserOnServer } from "@/lib/server-prefetch";
import { makeServerQueryClient } from "@/lib/server-query";

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const queryClient = makeServerQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.user(id),
    queryFn: () => fetchUserOnServer(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EditUserView userId={id} />
    </HydrationBoundary>
  );
}

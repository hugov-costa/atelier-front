import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { MonthlyReportView } from "@/app/(dashboard)/reports/_components/monthly-report-view";
import { Month } from "@/lib/enums";
import { queryKeys } from "@/lib/queryKeys";
import { fetchMonthlyReportOnServer } from "@/lib/server-prefetch";
import { makeServerQueryClient } from "@/lib/server-query";

export default async function ReportsPage() {
  const queryClient = makeServerQueryClient();
  const now = new Date();
  const month = (now.getMonth() + 1) as Month;
  const year = now.getFullYear();
  const params = { month, year };

  await queryClient.prefetchQuery({
    queryKey: queryKeys.monthlyReport(params),
    queryFn: () => fetchMonthlyReportOnServer(params),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MonthlyReportView initialMonth={month} initialYear={year} />
    </HydrationBoundary>
  );
}

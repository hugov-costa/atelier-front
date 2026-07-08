import { MonthlyReport, MonthlyReportParams } from "@/interfaces/monthlyReport";
import { apiClient } from "@/lib/api-client";
import { buildListQuery } from "@/lib/listQuery";
import {
  monthlyReportResponseSchema,
  parseApiResponse,
  resourceSchema,
} from "@/lib/responseSchemas";
import { HttpMethodType } from "@/types/httpMethod";

export async function getMonthlyReport(
  params: MonthlyReportParams = {},
): Promise<MonthlyReport> {
  const response = await apiClient<{ data: MonthlyReport }>({
    url: `/reports/monthly${buildListQuery(params)}`,
    method: HttpMethodType.GET,
    errorMessage: "Erro ao carregar o relatório mensal.",
  });

  return parseApiResponse(resourceSchema(monthlyReportResponseSchema), response)
    .data;
}

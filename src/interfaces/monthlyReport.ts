import { z } from "zod";

import { Month } from "@/lib/enums";
import { monthlyReportResponseSchema } from "@/lib/responseSchemas";

export type MonthlyReport = z.infer<typeof monthlyReportResponseSchema>;

export type MonthlyReportParams = {
  month?: Month;
  year?: number;
};

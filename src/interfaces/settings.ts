import { z } from "zod";

import { ResourceResponse } from "@/interfaces/authResponse";
import { settingResponseSchema } from "@/lib/responseSchemas";

export type Settings = z.infer<typeof settingResponseSchema>;

export type SettingsResourceResponse = ResourceResponse<Settings>;

export interface UpdateSettingsPayload {
  annual_enrollment_cost?: number;
  base_cost?: number;
  clay_amount_multiplier?: number;
  default_profit_margin?: number;
  piece_charge_billing_grace_days?: number;
  tuition_fee_due_day_of_month?: number;
  tuition_monthly_cost?: number;
}

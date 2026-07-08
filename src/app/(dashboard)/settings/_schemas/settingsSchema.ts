import { z } from "zod";

import { currencyField } from "@/lib/currencyField";
import { ValidationTranslator } from "@/lib/validation";

const MAX_MULTIPLIER = 9999.99;

function isFilledNumber(value: string): boolean {
  return value.trim() !== "" && Number.isFinite(Number(value));
}

function multiplier(t: ValidationTranslator) {
  return z
    .string()
    .refine(isFilledNumber, t("priceInvalid"))
    .refine((value) => Number(value) >= 0, t("priceNegative"))
    .refine((value) => Number(value) <= MAX_MULTIPLIER, t("tooLarge"));
}

export function createSettingsSchema(t: ValidationTranslator) {
  return z.object({
    annual_enrollment_cost: currencyField(t),
    base_cost: currencyField(t),
    clay_amount_multiplier: multiplier(t),
    default_profit_margin: multiplier(t),
    piece_charge_billing_grace_days: z.string().min(1, t("selectRequired")),
    tuition_fee_due_day_of_month: z.string().min(1, t("selectRequired")),
    tuition_monthly_cost: currencyField(t),
  });
}

export type SettingsFormValues = z.infer<
  ReturnType<typeof createSettingsSchema>
>;

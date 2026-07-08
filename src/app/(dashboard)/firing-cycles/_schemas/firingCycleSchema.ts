import { z } from "zod";

import { currencyField } from "@/lib/currencyField";
import { ValidationTranslator } from "@/lib/validation";

const MIN_CYCLE = 1;
const MAX_CYCLE = 255;
const MIN_DURATION = 1;
const MAX_DURATION = 100000;
const MAX_TEMPERATURE = 9999.99;

export function createFiringCycleSchema(t: ValidationTranslator) {
  return z.object({
    cycle: z
      .string()
      .refine(
        (value) => value.trim() !== "" && Number.isFinite(Number(value)),
        t("priceInvalid"),
      )
      .refine((value) => Number(value) >= MIN_CYCLE, t("atLeastOne"))
      .refine((value) => Number(value) <= MAX_CYCLE, t("tooLarge")),
    duration: z
      .string()
      .refine(
        (value) => value.trim() !== "" && Number.isFinite(Number(value)),
        t("priceInvalid"),
      )
      .refine((value) => Number(value) >= MIN_DURATION, t("atLeastOne"))
      .refine((value) => Number(value) <= MAX_DURATION, t("tooLarge")),
    name: z.string().min(2, t("nameMin")).max(255, t("tooLong")),
    price_per_unit: currencyField(t),
    temperature: z
      .string()
      .refine(
        (value) => value.trim() !== "" && Number.isFinite(Number(value)),
        t("priceInvalid"),
      )
      .refine((value) => Number(value) >= 0, t("priceNegative"))
      .refine((value) => Number(value) <= MAX_TEMPERATURE, t("tooLarge")),
  });
}

export type FiringCycleFormValues = z.infer<
  ReturnType<typeof createFiringCycleSchema>
>;

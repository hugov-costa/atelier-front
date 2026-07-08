import { z } from "zod";

import { ValidationTranslator } from "@/lib/validation";

const MAX_PROFIT_MARGIN = 9999.99;

export function createPieceCategorySchema(t: ValidationTranslator) {
  return z.object({
    available_until: z.string(),
    name: z.string().min(2, t("nameMin")).max(255, t("tooLong")),
    profit_margin: z
      .string()
      .refine(
        (value) => value.trim() !== "" && Number.isFinite(Number(value)),
        t("priceInvalid"),
      )
      .refine((value) => Number(value) >= 0, t("priceNegative"))
      .refine((value) => Number(value) <= MAX_PROFIT_MARGIN, t("tooLarge")),
  });
}

export type PieceCategoryFormValues = z.infer<
  ReturnType<typeof createPieceCategorySchema>
>;

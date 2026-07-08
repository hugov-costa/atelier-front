import { z } from "zod";

import { ValidationTranslator } from "@/lib/validation";

const MAX_AMOUNT = 999.999;

export function createPieceSchema(t: ValidationTranslator) {
  return z
    .object({
      clay_amount: z
        .string()
        .refine(
          (value) => value.trim() !== "" && Number.isFinite(Number(value)),
          t("priceInvalid"),
        )
        .refine((value) => Number(value) > 0, t("atLeastOne"))
        .refine((value) => Number(value) <= MAX_AMOUNT, t("tooLarge")),
      clay_id: z.string().min(1, t("selectRequired")),
      firing_cycle_ids: z.array(z.string()),
      glaze_amount: z.string(),
      glaze_id: z.string(),
      kind: z.string().min(1, t("selectRequired")),
      name: z.string().min(2, t("nameMin")).max(255, t("tooLong")),
      piece_category_id: z.string(),
      user_id: z.string().min(1, t("selectRequired")),
    })
    .refine(
      (data) => {
        const hasGlaze = data.glaze_id !== "" && data.glaze_id !== "none";
        if (!hasGlaze) return true;
        return (
          data.glaze_amount.trim() !== "" &&
          Number.isFinite(Number(data.glaze_amount)) &&
          Number(data.glaze_amount) > 0
        );
      },
      { path: ["glaze_amount"], message: t("priceInvalid") },
    );
}

export type PieceFormValues = z.infer<ReturnType<typeof createPieceSchema>>;

import { z } from "zod";

import { currencyField } from "@/lib/currencyField";
import { ValidationTranslator } from "@/lib/validation";

export function createSingleClassSchema(t: ValidationTranslator) {
  return z
    .object({
      end_datetime: z.string().min(1, t("dateRequired")),
      is_replacement: z.boolean(),
      price: currencyField(t, { required: false }),
      start_datetime: z.string().min(1, t("dateRequired")),
      user_ids: z.array(z.string()).min(1, t("atLeastOne")),
    })
    .refine(
      (data) =>
        data.start_datetime === "" ||
        data.end_datetime === "" ||
        data.end_datetime > data.start_datetime,
      { path: ["end_datetime"], message: t("endAfterStart") },
    );
}

export type SingleClassFormValues = z.infer<
  ReturnType<typeof createSingleClassSchema>
>;

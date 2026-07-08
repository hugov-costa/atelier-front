import { z } from "zod";

import { ValidationTranslator } from "@/lib/validation";

export function createRecurrentClassSchema(t: ValidationTranslator) {
  return z
    .object({
      day_of_the_week: z.string().min(1, t("selectRequired")),
      end_time: z.string().min(1, t("timeRequired")),
      start_time: z.string().min(1, t("timeRequired")),
      user_ids: z.array(z.string()).min(1, t("atLeastOne")),
    })
    .refine(
      (data) =>
        data.start_time === "" ||
        data.end_time === "" ||
        data.end_time > data.start_time,
      { path: ["end_time"], message: t("endAfterStart") },
    );
}

export type RecurrentClassFormValues = z.infer<
  ReturnType<typeof createRecurrentClassSchema>
>;

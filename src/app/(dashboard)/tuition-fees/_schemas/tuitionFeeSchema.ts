import { z } from "zod";

import { ValidationTranslator } from "@/lib/validation";

export function createTuitionFeeSchema(t: ValidationTranslator) {
  return z.object({
    enrollment_id: z.string().min(1, t("selectRequired")),
  });
}

export type TuitionFeeFormValues = z.infer<
  ReturnType<typeof createTuitionFeeSchema>
>;

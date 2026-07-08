import { z } from "zod";

import { ValidationTranslator } from "@/lib/validation";

export function createEnrollmentSchema(t: ValidationTranslator) {
  return z.object({
    annual_fee_due_date: z.string(),
    annual_fee_is_paid: z.boolean(),
    is_exempt_from_annual_fee: z.boolean(),
    is_exempt_from_piece_charges: z.boolean(),
    is_exempt_from_tuition_fee: z.boolean(),
    user_id: z.string().min(1, t("selectRequired")),
  });
}

export type EnrollmentFormValues = z.infer<
  ReturnType<typeof createEnrollmentSchema>
>;

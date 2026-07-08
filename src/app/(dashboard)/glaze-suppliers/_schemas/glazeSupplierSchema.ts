import { z } from "zod";

import { ValidationTranslator } from "@/lib/validation";

export function createGlazeSupplierSchema(t: ValidationTranslator) {
  return z.object({
    email: z.string().min(1, t("emailRequired")).email(t("emailInvalid")),
    name: z.string().min(2, t("nameMin")).max(255, t("tooLong")),
    phone: z.string().regex(/^\d{10,11}$/, t("phoneDigits")),
  });
}

export type GlazeSupplierFormValues = z.infer<
  ReturnType<typeof createGlazeSupplierSchema>
>;

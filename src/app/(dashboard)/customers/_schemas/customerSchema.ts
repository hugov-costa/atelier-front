import { z } from "zod";

import { ValidationTranslator } from "@/lib/validation";

export function createCustomerSchema(t: ValidationTranslator) {
  return z.object({
    description: z.string().max(1000, t("tooLong")),
    email: z.union([z.literal(""), z.string().email(t("emailInvalid"))]),
    name: z.string().min(1, t("nameRequired")).max(255, t("tooLong")),
    phone: z.string().max(255, t("tooLong")),
  });
}

export type CustomerFormValues = z.infer<
  ReturnType<typeof createCustomerSchema>
>;

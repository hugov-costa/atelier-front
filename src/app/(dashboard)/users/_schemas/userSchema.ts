import { z } from "zod";

import { emailField, ValidationTranslator } from "@/lib/validation";

export function createUserSchema(t: ValidationTranslator) {
  return z.object({
    name: z.string().min(1, t("nameRequired")),
    email: emailField(t),
  });
}

export type UserFormValues = z.infer<ReturnType<typeof createUserSchema>>;

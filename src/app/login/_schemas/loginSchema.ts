import { z } from "zod";

import { emailField, ValidationTranslator } from "@/lib/validation";

export function createLoginSchema(t: ValidationTranslator) {
  return z.object({
    email: emailField(t),
    password: z.string().min(1, t("passwordRequired")),
    code: z.string().optional(),
  });
}

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;

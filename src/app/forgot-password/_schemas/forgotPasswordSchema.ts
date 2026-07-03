import { z } from "zod";

import { emailField, ValidationTranslator } from "@/lib/validation";

export function createForgotPasswordSchema(t: ValidationTranslator) {
  return z.object({
    email: emailField(t),
  });
}

export type ForgotPasswordFormValues = z.infer<
  ReturnType<typeof createForgotPasswordSchema>
>;

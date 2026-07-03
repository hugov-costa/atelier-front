import { z } from "zod";

import { strongPasswordField, ValidationTranslator } from "@/lib/validation";

export function createResetPasswordSchema(t: ValidationTranslator) {
  return z
    .object({
      password: strongPasswordField(t),
      passwordConfirmation: z.string().min(1, t("passwordConfirm")),
    })
    .refine((values) => values.password === values.passwordConfirmation, {
      message: t("passwordsMismatch"),
      path: ["passwordConfirmation"],
    });
}

export type ResetPasswordFormValues = z.infer<
  ReturnType<typeof createResetPasswordSchema>
>;

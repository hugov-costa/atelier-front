import { z } from "zod";

import { strongPasswordField, ValidationTranslator } from "@/lib/validation";

export function createSetPasswordSchema(t: ValidationTranslator) {
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

export type SetPasswordFormValues = z.infer<
  ReturnType<typeof createSetPasswordSchema>
>;

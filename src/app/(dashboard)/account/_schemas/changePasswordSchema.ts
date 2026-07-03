import { z } from "zod";

import { strongPasswordField, ValidationTranslator } from "@/lib/validation";

export function createChangePasswordSchema(t: ValidationTranslator) {
  return z
    .object({
      currentPassword: z.string().min(1, t("currentPasswordRequired")),
      password: strongPasswordField(t),
      passwordConfirmation: z.string().min(1, t("passwordConfirmNew")),
    })
    .refine((values) => values.password === values.passwordConfirmation, {
      message: t("passwordsMismatch"),
      path: ["passwordConfirmation"],
    })
    .refine((values) => values.password !== values.currentPassword, {
      message: t("passwordDifferent"),
      path: ["password"],
    });
}

export type ChangePasswordFormValues = z.infer<
  ReturnType<typeof createChangePasswordSchema>
>;

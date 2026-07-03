import { z } from "zod";

import {
  emailField,
  strongPasswordField,
  ValidationTranslator,
} from "@/lib/validation";

export function createRegisterSchema(t: ValidationTranslator) {
  return z
    .object({
      name: z.string().min(1, t("nameRequired")),
      email: emailField(t),
      password: strongPasswordField(t),
      passwordConfirmation: z.string().min(1, t("passwordConfirm")),
    })
    .refine((values) => values.password === values.passwordConfirmation, {
      message: t("passwordsMismatch"),
      path: ["passwordConfirmation"],
    });
}

export type RegisterFormValues = z.infer<
  ReturnType<typeof createRegisterSchema>
>;

import { z } from "zod";

import { emailField, ValidationTranslator } from "@/lib/validation";

export function createProfileSchema(t: ValidationTranslator) {
  return z.object({
    name: z.string().min(1, t("nameRequired")),
    email: emailField(t),
    currentPassword: z.string(),
  });
}

export type ProfileFormValues = z.infer<ReturnType<typeof createProfileSchema>>;

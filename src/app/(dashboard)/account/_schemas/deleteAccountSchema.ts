import { z } from "zod";

import { ValidationTranslator } from "@/lib/validation";

export function createDeleteAccountSchema(t: ValidationTranslator) {
  return z.object({
    password: z.string().min(1, t("currentPasswordRequired")),
  });
}

export type DeleteAccountFormValues = z.infer<
  ReturnType<typeof createDeleteAccountSchema>
>;

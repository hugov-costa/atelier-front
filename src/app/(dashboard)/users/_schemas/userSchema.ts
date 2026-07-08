import { z } from "zod";

import { emailField, ValidationTranslator } from "@/lib/validation";

function todayYmd(): string {
  return new Date().toISOString().slice(0, 10);
}

export function createUserSchema(t: ValidationTranslator) {
  return z.object({
    admission_date: z.string(),
    birthday: z
      .string()
      .refine((value) => value === "" || value < todayYmd(), t("birthdayPast")),
    email: emailField(t),
    is_active: z.boolean(),
    name: z.string().min(1, t("nameRequired")),
    phone: z
      .string()
      .refine(
        (value) => value === "" || /^\d{10,11}$/.test(value),
        t("phoneDigits"),
      ),
    role: z.string(),
  });
}

export type UserFormValues = z.infer<ReturnType<typeof createUserSchema>>;

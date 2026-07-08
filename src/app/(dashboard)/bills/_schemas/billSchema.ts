import { z } from "zod";

import { currencyField } from "@/lib/currencyField";
import { ValidationTranslator } from "@/lib/validation";

export function createBillSchema(t: ValidationTranslator) {
  return z
    .object({
      description: z.string().max(1000, t("tooLong")),
      due_date: z.string().min(1, t("dateRequired")),
      is_recurrent: z.boolean(),
      name: z.string().min(3, t("nameMin")).max(255, t("tooLong")),
      reference_month: z.string().min(1, t("selectRequired")),
      reference_year: z
        .string()
        .refine(
          (value) =>
            /^\d{4}$/.test(value) &&
            Number(value) >= 2000 &&
            Number(value) <= 2100,
          t("yearInvalid"),
        ),
      value: currencyField(t),
    })
    .refine(
      (data) => {
        if (
          !/^\d{4}$/.test(data.reference_year) ||
          data.reference_month === "" ||
          data.due_date === ""
        ) {
          return true;
        }

        const first = `${data.reference_year}-${String(
          data.reference_month,
        ).padStart(2, "0")}-01`;

        return data.due_date >= first;
      },
      { path: ["due_date"], message: t("dueBeforeReference") },
    );
}

export type BillFormValues = z.infer<ReturnType<typeof createBillSchema>>;

import { z } from "zod";

import { currencyField } from "@/lib/currencyField";
import { ValidationTranslator } from "@/lib/validation";

export function createClaySchema(t: ValidationTranslator) {
  return z.object({
    clay_supplier_id: z.string().min(1, t("supplierRequired")),
    description: z.string().max(1000, t("tooLong")),
    name: z.string().min(2, t("nameMin")).max(255, t("tooLong")),
    price: currencyField(t),
  });
}

export type ClayFormValues = z.infer<ReturnType<typeof createClaySchema>>;

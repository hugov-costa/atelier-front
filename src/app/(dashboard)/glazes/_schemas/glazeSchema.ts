import { z } from "zod";

import { currencyField } from "@/lib/currencyField";
import { ValidationTranslator } from "@/lib/validation";

export function createGlazeSchema(t: ValidationTranslator) {
  return z.object({
    description: z.string().max(1000, t("tooLong")),
    glaze_supplier_id: z.string().min(1, t("supplierRequired")),
    name: z.string().min(2, t("nameMin")).max(255, t("tooLong")),
    price: currencyField(t),
  });
}

export type GlazeFormValues = z.infer<ReturnType<typeof createGlazeSchema>>;

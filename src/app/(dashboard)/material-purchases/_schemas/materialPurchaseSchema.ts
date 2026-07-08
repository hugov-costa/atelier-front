import { z } from "zod";

import { currencyField } from "@/lib/currencyField";
import { ValidationTranslator } from "@/lib/validation";

const MAX_QUANTITY = 99999.999;

function isFilledNumber(value: string): boolean {
  return value.trim() !== "" && Number.isFinite(Number(value));
}

export function createMaterialPurchaseSchema(t: ValidationTranslator) {
  return z.object({
    description: z.string().max(1000, t("tooLong")),
    freight: currencyField(t, { required: false, max: 99999999 }),
    invoice_number: z.string().max(255, t("tooLong")),
    lot: z.string().max(255, t("tooLong")),
    material_id: z.string().min(1, t("selectRequired")),
    material_type: z.string().min(1, t("selectRequired")),
    payment_method: z.string().min(1, t("selectRequired")),
    purchase_date: z.string().min(1, t("dateRequired")),
    quantity: z
      .string()
      .refine(isFilledNumber, t("priceInvalid"))
      .refine((value) => Number(value) > 0, t("atLeastOne"))
      .refine((value) => Number(value) <= MAX_QUANTITY, t("tooLarge")),
    receipt_date: z.string(),
    total_price: currencyField(t, { max: 99999999 }),
    unit_price: currencyField(t, { max: 99999999 }),
  });
}

export type MaterialPurchaseFormValues = z.infer<
  ReturnType<typeof createMaterialPurchaseSchema>
>;

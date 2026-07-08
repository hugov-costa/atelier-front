import { z } from "zod";

import { currencyField } from "@/lib/currencyField";
import { ValidationTranslator } from "@/lib/validation";

export function createCommissionOrderSchema(t: ValidationTranslator) {
  return z
    .object({
      customer_id: z.string().min(1, t("selectRequired")),
      delivery_date: z.string(),
      description: z.string().max(1000, t("tooLong")),
      is_paid: z.boolean(),
      order_date: z.string().min(1, t("dateRequired")),
      piece_ids: z.array(z.string()),
      sale_total_override: currencyField(t, {
        required: false,
        max: 99999999,
      }),
      shipping_charged: currencyField(t, { required: false, max: 99999999 }),
      shipping_cost: currencyField(t, { required: false, max: 99999999 }),
      status: z.string().min(1, t("selectRequired")),
    })
    .refine(
      (data) =>
        data.delivery_date === "" ||
        data.order_date === "" ||
        data.delivery_date >= data.order_date,
      { path: ["delivery_date"], message: t("deliveryAfterOrder") },
    );
}

export type CommissionOrderFormValues = z.infer<
  ReturnType<typeof createCommissionOrderSchema>
>;

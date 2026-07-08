import { z } from "zod";

import { ValidationTranslator } from "@/lib/validation";
import { centsFromMaskedInput } from "@/utils/formatters";

const MAX_CENTS = 9999999;

interface CurrencyFieldOptions {
  max?: number;
  required?: boolean;
}

export function currencyField(
  t: ValidationTranslator,
  options: CurrencyFieldOptions = {},
) {
  const required = options.required ?? true;
  const max = options.max ?? MAX_CENTS;

  return z.string().superRefine((value, ctx) => {
    if (value === "") {
      if (required) {
        ctx.addIssue({ code: "custom", message: t("priceInvalid") });
      }

      return;
    }

    if (centsFromMaskedInput(value) > max) {
      ctx.addIssue({ code: "custom", message: t("tooLarge") });
    }
  });
}

import { z } from "zod";

export type ValidationTranslator = (key: string) => string;

const MINIMUM_PASSWORD_LENGTH = 8;

export function emailField(t: ValidationTranslator) {
  return z.string().min(1, t("emailRequired")).email(t("emailInvalid"));
}

export function strongPasswordField(t: ValidationTranslator) {
  return z
    .string()
    .min(MINIMUM_PASSWORD_LENGTH, t("passwordMin"))
    .regex(/[a-z]/, t("passwordLower"))
    .regex(/[A-Z]/, t("passwordUpper"))
    .regex(/[0-9]/, t("passwordNumber"))
    .regex(/[^A-Za-z0-9]/, t("passwordSymbol"));
}

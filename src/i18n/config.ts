import enMessages from "@/i18n/messages/en.json";
import ptBrMessages from "@/i18n/messages/pt-BR.json";

export const locales = ["pt-BR", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "pt-BR";

export const localeCookieName = "NEXT_LOCALE";

export const localeLabels: Record<Locale, string> = {
  "pt-BR": "Português (Brasil)",
  en: "English",
};

export type Messages = typeof ptBrMessages;

export const messagesByLocale: Record<Locale, Messages> = {
  "pt-BR": ptBrMessages,
  en: enMessages,
};

export function isLocale(value: string | null | undefined): value is Locale {
  return (
    value !== null &&
    value !== undefined &&
    (locales as readonly string[]).includes(value)
  );
}

export function resolveLocale(value: string | null | undefined): Locale {
  return isLocale(value) ? value : defaultLocale;
}

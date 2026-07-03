import { describe, expect, it } from "vitest";

import { defaultLocale, isLocale, resolveLocale } from "@/i18n/config";

describe("isLocale", () => {
  it("accepts supported locales", () => {
    expect(isLocale("pt-BR")).toBe(true);
    expect(isLocale("en")).toBe(true);
  });

  it("rejects unsupported or empty values", () => {
    expect(isLocale("fr")).toBe(false);
    expect(isLocale("")).toBe(false);
    expect(isLocale(null)).toBe(false);
    expect(isLocale(undefined)).toBe(false);
  });
});

describe("resolveLocale", () => {
  it("returns the locale when supported", () => {
    expect(resolveLocale("en")).toBe("en");
  });

  it("falls back to the default locale otherwise", () => {
    expect(resolveLocale("fr")).toBe(defaultLocale);
    expect(resolveLocale(undefined)).toBe(defaultLocale);
  });
});

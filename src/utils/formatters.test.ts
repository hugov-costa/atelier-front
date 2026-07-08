import { describe, expect, it } from "vitest";

import {
  centsFromCurrencyInput,
  centsFromMaskedInput,
  currencyInputFromCents,
  formatCurrencyFromCents,
  formatDate,
  formatDateTime,
  getInitials,
  maskCurrencyInput,
  maskedInputFromCents,
} from "@/utils/formatters";

describe("getInitials", () => {
  it("retorna as iniciais do primeiro e último nome", () => {
    expect(getInitials("Jane Doe")).toBe("JD");
  });

  it("retorna uma inicial para nome único", () => {
    expect(getInitials("Jane")).toBe("J");
  });

  it("retorna um marcador para nome vazio", () => {
    expect(getInitials("   ")).toBe("?");
  });
});

describe("formatDateTime", () => {
  it("retorna um traço para valores ausentes", () => {
    expect(formatDateTime(undefined)).toBe("—");
    expect(formatDateTime(null)).toBe("—");
  });

  it("retorna um traço para datas inválidas", () => {
    expect(formatDateTime("not-a-date")).toBe("—");
  });

  it("formata uma data ISO válida", () => {
    expect(formatDateTime("2026-06-23T17:52:32.000000Z")).not.toBe("—");
  });
});

describe("formatDate", () => {
  it("retorna um traço para valores ausentes ou inválidos", () => {
    expect(formatDate(undefined)).toBe("—");
    expect(formatDate(null)).toBe("—");
    expect(formatDate("not-a-date")).toBe("—");
  });

  it("formata uma data no dia correto (UTC)", () => {
    expect(formatDate("2026-07-06")).toBe("06/07/2026");
  });
});

describe("moeda em centavos", () => {
  it("formata centavos como moeda em pt-BR", () => {
    expect(formatCurrencyFromCents(15000)).toContain("150,00");
    expect(formatCurrencyFromCents(null)).toBe("—");
    expect(formatCurrencyFromCents(undefined)).toBe("—");
  });

  it("converte entre centavos e a entrada em reais", () => {
    expect(currencyInputFromCents(15050)).toBe(150.5);
    expect(currencyInputFromCents(null)).toBe(0);
    expect(centsFromCurrencyInput(150.5)).toBe(15050);
    expect(centsFromCurrencyInput(0)).toBe(0);
  });
});

describe("máscara de moeda", () => {
  it("acumula os dígitos como centavos, sem separador de milhar", () => {
    expect(maskCurrencyInput("1")).toBe("0,01");
    expect(maskCurrencyInput("150")).toBe("1,50");
    expect(maskCurrencyInput("123456")).toBe("1234,56");
  });

  it("remove zeros à esquerda e caracteres não numéricos", () => {
    expect(maskCurrencyInput("007")).toBe("0,07");
    expect(maskCurrencyInput("R$ 1.234,56")).toBe("1234,56");
  });

  it("retorna string vazia quando não há dígitos", () => {
    expect(maskCurrencyInput("")).toBe("");
    expect(maskCurrencyInput("R$")).toBe("");
  });

  it("converte a máscara para centavos", () => {
    expect(centsFromMaskedInput("1234,56")).toBe(123456);
    expect(centsFromMaskedInput("0,07")).toBe(7);
    expect(centsFromMaskedInput("")).toBe(0);
  });

  it("converte centavos para a máscara", () => {
    expect(maskedInputFromCents(123456)).toBe("1234,56");
    expect(maskedInputFromCents(7)).toBe("0,07");
    expect(maskedInputFromCents(null)).toBe("");
    expect(maskedInputFromCents(undefined)).toBe("");
  });
});

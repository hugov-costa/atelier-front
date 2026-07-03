import { describe, expect, it } from "vitest";

import { formatDateTime, getInitials } from "@/utils/formatters";

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

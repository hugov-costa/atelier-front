import { describe, expect, it } from "vitest";

import { decimalOnly, digitsOnly } from "@/utils/inputSanitizers";

describe("digitsOnly", () => {
  it("remove tudo que não for dígito", () => {
    expect(digitsOnly("(11) 99999-8888")).toBe("11999998888");
    expect(digitsOnly("abc123")).toBe("123");
  });
});

describe("decimalOnly", () => {
  it("mantém apenas dígitos e um único separador decimal", () => {
    expect(decimalOnly("150.50")).toBe("150.50");
    expect(decimalOnly("1a2b.3c4")).toBe("12.34");
    expect(decimalOnly("10.5.7")).toBe("10.57");
    expect(decimalOnly("abc")).toBe("");
  });
});

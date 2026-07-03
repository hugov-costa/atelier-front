import { describe, expect, it } from "vitest";

import { emailField, strongPasswordField } from "@/lib/validation";

const t = (key: string) => key;

describe("emailField", () => {
  const schema = emailField(t);

  it("aceita e-mails válidos", () => {
    expect(schema.safeParse("jane@example.com").success).toBe(true);
  });

  it("rejeita e-mails inválidos", () => {
    expect(schema.safeParse("invalido").success).toBe(false);
    expect(schema.safeParse("").success).toBe(false);
  });
});

describe("strongPasswordField", () => {
  const schema = strongPasswordField(t);

  it("aceita uma senha forte", () => {
    expect(schema.safeParse("Password123!").success).toBe(true);
  });

  it("rejeita senha sem símbolo", () => {
    expect(schema.safeParse("Password123").success).toBe(false);
  });

  it("rejeita senha curta", () => {
    expect(schema.safeParse("Pa1!").success).toBe(false);
  });

  it("rejeita senha sem maiúscula", () => {
    expect(schema.safeParse("password123!").success).toBe(false);
  });
});

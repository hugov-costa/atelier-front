import { describe, expect, it } from "vitest";

import { resolveSafeRedirectPath } from "@/lib/session-redirect";

describe("resolveSafeRedirectPath", () => {
  it("retorna o caminho interno informado", () => {
    expect(resolveSafeRedirectPath("/users", "/")).toBe("/users");
  });

  it("usa o fallback quando o alvo é nulo", () => {
    expect(resolveSafeRedirectPath(null, "/")).toBe("/");
  });

  it("rejeita URLs absolutas (open redirect)", () => {
    expect(resolveSafeRedirectPath("https://evil.com", "/")).toBe("/");
    expect(resolveSafeRedirectPath("//evil.com", "/")).toBe("/");
  });

  it("rejeita caminhos com barra invertida (normalizada pelo browser)", () => {
    expect(resolveSafeRedirectPath("/\\evil.com", "/")).toBe("/");
    expect(resolveSafeRedirectPath("/\\/evil.com", "/")).toBe("/");
    expect(resolveSafeRedirectPath("\\evil.com", "/")).toBe("/");
  });
});

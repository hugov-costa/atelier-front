import { describe, expect, it } from "vitest";

import { HttpMethodType, isMutatingHttpMethod } from "@/types/httpMethod";

describe("isMutatingHttpMethod", () => {
  it("considera POST, PUT, PATCH e DELETE como mutantes", () => {
    expect(isMutatingHttpMethod(HttpMethodType.POST)).toBe(true);
    expect(isMutatingHttpMethod(HttpMethodType.PUT)).toBe(true);
    expect(isMutatingHttpMethod(HttpMethodType.PATCH)).toBe(true);
    expect(isMutatingHttpMethod(HttpMethodType.DELETE)).toBe(true);
  });

  it("não considera GET como mutante", () => {
    expect(isMutatingHttpMethod(HttpMethodType.GET)).toBe(false);
  });
});

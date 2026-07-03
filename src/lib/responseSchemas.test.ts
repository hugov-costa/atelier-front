import { describe, expect, it } from "vitest";

import {
  parseApiResponse,
  paginatedSchema,
  userResponseSchema,
} from "@/lib/responseSchemas";
import { HttpError } from "@/utils/httpError";

const validUser = {
  id: "01ABC",
  name: "Jane",
  email: "jane@example.com",
  role: "user",
  avatar_url: null,
  email_verified_at: null,
  created_at: "2026-06-23T17:52:32.000000Z",
  updated_at: "2026-06-23T17:52:32.000000Z",
};

describe("parseApiResponse", () => {
  it("retorna os dados quando a resposta é válida", () => {
    expect(parseApiResponse(userResponseSchema, validUser)).toMatchObject({
      id: "01ABC",
      email: "jane@example.com",
    });
  });

  it("lança HttpError quando o contrato diverge", () => {
    expect(() =>
      parseApiResponse(userResponseSchema, { id: 123, name: "Jane" }),
    ).toThrowError(HttpError);
  });

  it("valida o envelope paginado com data/meta/links", () => {
    const payload = {
      data: [validUser],
      links: { first: "a", last: "b", prev: null, next: null },
      meta: {
        current_page: 1,
        from: 1,
        last_page: 1,
        per_page: 10,
        to: 1,
        total: 1,
      },
    };

    expect(
      parseApiResponse(paginatedSchema(userResponseSchema), payload).data,
    ).toHaveLength(1);
  });

  it("rejeita um envelope paginado sem meta", () => {
    expect(() =>
      parseApiResponse(paginatedSchema(userResponseSchema), {
        data: [validUser],
        links: { first: null, last: null, prev: null, next: null },
      }),
    ).toThrowError(HttpError);
  });
});

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getCurrentUser, login } from "@/services/authService";
import { HttpError } from "@/utils/httpError";

const user = {
  id: "01ABC",
  name: "Jane",
  email: "jane@example.com",
  admin: false,
  avatar_url: null,
  email_verified_at: null,
  created_at: "2026-06-23T17:52:32.000000Z",
  updated_at: "2026-06-23T17:52:32.000000Z",
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function mockFetchByUrl(handler: (url: string) => Response): void {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: string | URL) => handler(String(input))),
  );
}

beforeEach(() => {
  document.cookie = "XSRF-TOKEN=token";
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("login", () => {
  it("obtém o cookie CSRF e retorna o usuário em data.user", async () => {
    mockFetchByUrl((url) => {
      if (url.includes("/sanctum/csrf-cookie")) {
        return new Response(null, { status: 204 });
      }
      return jsonResponse({
        data: { user, token_type: "Bearer" },
        message: null,
      });
    });

    const result = await login({ email: user.email, password: "x" });

    expect(result.data?.user.email).toBe("jane@example.com");
    expect(fetch).toHaveBeenCalledTimes(2);
  });
});

describe("getCurrentUser", () => {
  it("desempacota o usuário do envelope data", async () => {
    mockFetchByUrl(() => jsonResponse({ data: user, message: null }));

    const result = await getCurrentUser();

    expect(result.id).toBe("01ABC");
  });

  it("lança HttpError quando o contrato do usuário diverge", async () => {
    mockFetchByUrl(() => jsonResponse({ data: { id: 1 }, message: null }));

    await expect(getCurrentUser()).rejects.toBeInstanceOf(HttpError);
  });
});

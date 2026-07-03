import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { apiClient, requestSignedApiUrl } from "@/lib/api-client";
import { FormValidationHttpError } from "@/utils/formValidationError";
import { HttpError } from "@/utils/httpError";
import { HttpMethodType } from "@/types/httpMethod";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function lastRequestHeaders(): Record<string, string> {
  const fetchMock = vi.mocked(fetch);
  const init = fetchMock.mock.calls[fetchMock.mock.calls.length - 1]?.[1];
  return (init?.headers ?? {}) as Record<string, string>;
}

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn());
  document.cookie = "XSRF-TOKEN=token%20123";
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("apiClient", () => {
  it("não envia X-XSRF-TOKEN em requisições GET", async () => {
    vi.mocked(fetch).mockResolvedValue(jsonResponse({ data: {} }));

    await apiClient({ url: "/user", method: HttpMethodType.GET });

    expect(lastRequestHeaders()["X-XSRF-TOKEN"]).toBeUndefined();
  });

  it("envia o X-XSRF-TOKEN decodificado em requisições mutantes", async () => {
    vi.mocked(fetch).mockResolvedValue(jsonResponse({}, 200));

    await apiClient({ url: "/login", method: HttpMethodType.POST, body: {} });

    expect(lastRequestHeaders()["X-XSRF-TOKEN"]).toBe("token 123");
    expect(lastRequestHeaders()["Content-Type"]).toBe("application/json");
  });

  it("prefere o cookie __Host-XSRF-TOKEN quando presente", async () => {
    vi.mocked(fetch).mockResolvedValue(jsonResponse({}, 200));
    const cookieSpy = vi
      .spyOn(document, "cookie", "get")
      .mockReturnValue(
        "__Host-XSRF-TOKEN=host%20token; XSRF-TOKEN=token%20123",
      );

    await apiClient({ url: "/login", method: HttpMethodType.POST, body: {} });

    expect(lastRequestHeaders()["X-XSRF-TOKEN"]).toBe("host token");

    cookieSpy.mockRestore();
  });

  it("não define Content-Type em uploads FormData", async () => {
    vi.mocked(fetch).mockResolvedValue(jsonResponse({ data: {} }));

    const formData = new FormData();
    formData.append("avatar", "x");

    await apiClient({
      url: "/users/1/avatar",
      method: HttpMethodType.POST,
      body: formData,
    });

    expect(lastRequestHeaders()["Content-Type"]).toBeUndefined();
    expect(lastRequestHeaders()["X-XSRF-TOKEN"]).toBe("token 123");
  });

  it("converte 422 em FormValidationHttpError com erros de campo", async () => {
    vi.mocked(fetch).mockResolvedValue(
      jsonResponse(
        { message: "Inválido", errors: { email: ["Já em uso."] } },
        422,
      ),
    );

    await expect(
      apiClient({ url: "/register", method: HttpMethodType.POST, body: {} }),
    ).rejects.toMatchObject({
      status: 422,
      fieldErrors: { email: ["Já em uso."] },
    });

    const error = await apiClient({
      url: "/register",
      method: HttpMethodType.POST,
      body: {},
    }).catch((caught) => caught);
    expect(error).toBeInstanceOf(FormValidationHttpError);
  });

  it("converte outros status de erro em HttpError", async () => {
    vi.mocked(fetch).mockResolvedValue(
      jsonResponse({ detail: "Proibido" }, 403),
    );

    const error = await apiClient({ url: "/users" }).catch((caught) => caught);

    expect(error).toBeInstanceOf(HttpError);
    const httpError = error as HttpError;
    expect(httpError.status).toBe(403);
    expect(httpError.message).toBe("Proibido");
  });
});

describe("requestSignedApiUrl", () => {
  it("rejeita URLs de outra origem", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 204 }));

    await expect(
      requestSignedApiUrl("https://evil.com/api/v1/email/verify/1/abc"),
    ).rejects.toBeInstanceOf(HttpError);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("aceita URLs da mesma origem da API", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 204 }));

    await expect(
      requestSignedApiUrl("http://localhost:8000/api/v1/email/verify/1/abc"),
    ).resolves.toBeUndefined();
    expect(fetch).toHaveBeenCalledOnce();
  });
});

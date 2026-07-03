import { describe, expect, it } from "vitest";

import { HttpStatusType } from "@/types/httpStatus";
import { HttpError } from "@/utils/httpError";
import { resolveHttpErrorMessage } from "@/utils/resolveHttpErrorMessage";

const translate = (key: string, values?: Record<string, string | number>) =>
  values ? `${key}:${JSON.stringify(values)}` : key;

describe("resolveHttpErrorMessage", () => {
  it("returns the server message for a generic HTTP error", () => {
    const error = new HttpError(HttpStatusType.FORBIDDEN, "Acesso negado.");

    expect(resolveHttpErrorMessage(error, translate, "fallbackKey")).toBe(
      "Acesso negado.",
    );
  });

  it("uses the delayed rate-limit message when retry-after is known", () => {
    const error = new HttpError(HttpStatusType.TOO_MANY_REQUESTS, "ignored", {
      retryAfterSeconds: 42,
    });

    expect(resolveHttpErrorMessage(error, translate, "fallbackKey")).toBe(
      `tooManyRequestsWithDelay:${JSON.stringify({ seconds: 42 })}`,
    );
  });

  it("uses the generic rate-limit message without a delay", () => {
    const error = new HttpError(HttpStatusType.TOO_MANY_REQUESTS, "ignored");

    expect(resolveHttpErrorMessage(error, translate, "fallbackKey")).toBe(
      "tooManyRequests",
    );
  });

  it("falls back to the translation key for non-HTTP errors", () => {
    expect(
      resolveHttpErrorMessage(new Error("boom"), translate, "fallbackKey"),
    ).toBe("fallbackKey");
    expect(resolveHttpErrorMessage(null, translate, "fallbackKey")).toBe(
      "fallbackKey",
    );
  });
});

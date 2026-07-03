import { afterEach, describe, expect, it, vi } from "vitest";

import {
  captureError,
  ErrorReporter,
  setErrorReporter,
} from "@/lib/error-reporter";

const noopReporter: ErrorReporter = { report: () => {} };

afterEach(() => {
  setErrorReporter(noopReporter);
});

describe("captureError", () => {
  it("forwards the error and context to the active reporter", () => {
    const report = vi.fn();
    setErrorReporter({ report });

    const error = new Error("boom");
    captureError(error, { source: "test", requestId: "abc" });

    expect(report).toHaveBeenCalledWith(error, {
      source: "test",
      requestId: "abc",
    });
  });

  it("never throws when the reporter itself fails", () => {
    setErrorReporter({
      report: () => {
        throw new Error("reporter exploded");
      },
    });

    expect(() =>
      captureError(new Error("boom"), { source: "test" }),
    ).not.toThrow();
  });
});

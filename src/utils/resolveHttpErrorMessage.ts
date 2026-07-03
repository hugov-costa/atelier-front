import { HttpStatusType } from "@/types/httpStatus";
import { HttpError } from "@/utils/httpError";

export type ToastTranslator = (
  key: string,
  values?: Record<string, string | number>,
) => string;

export function resolveHttpErrorMessage(
  error: unknown,
  t: ToastTranslator,
  fallbackKey: string,
): string {
  if (error instanceof HttpError) {
    if (error.status === HttpStatusType.TOO_MANY_REQUESTS) {
      return error.retryAfterSeconds && error.retryAfterSeconds > 0
        ? t("tooManyRequestsWithDelay", { seconds: error.retryAfterSeconds })
        : t("tooManyRequests");
    }

    return error.message;
  }

  return t(fallbackKey);
}

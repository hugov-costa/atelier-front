import { clientEnvironment } from "@/lib/env";
import {
  FieldValidationErrors,
  FormValidationHttpError,
} from "@/utils/formValidationError";
import { HttpError } from "@/utils/httpError";
import { HttpMethodType, isMutatingHttpMethod } from "@/types/httpMethod";
import { HttpStatusType } from "@/types/httpStatus";

interface ApiClientOptions {
  url: string;
  method?: HttpMethodType;
  body?: unknown;
  headers?: HeadersInit;
  errorMessage?: string;
}

interface ProblemPayload {
  detail?: unknown;
  title?: unknown;
  message?: unknown;
  errors?: unknown;
}

const CSRF_COOKIE_NAMES = ["__Host-XSRF-TOKEN", "XSRF-TOKEN"];
const CSRF_HEADER_NAME = "X-XSRF-TOKEN";
const REQUEST_ID_HEADER = "X-Request-Id";
const RETRY_AFTER_HEADER = "Retry-After";

function generateRequestId(): string | null {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return null;
}

function parseRetryAfterSeconds(response: Response): number | null {
  const header = response.headers.get(RETRY_AFTER_HEADER);

  if (!header) {
    return null;
  }

  const asSeconds = Number(header);

  if (Number.isFinite(asSeconds)) {
    return Math.max(0, Math.round(asSeconds));
  }

  const asTimestamp = Date.parse(header);

  if (!Number.isNaN(asTimestamp)) {
    return Math.max(0, Math.round((asTimestamp - Date.now()) / 1000));
  }

  return null;
}

function readCookie(name: string): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  const match = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${name}=`));

  if (!match) {
    return null;
  }

  return decodeURIComponent(match.slice(name.length + 1));
}

function buildCsrfHeaders(method: HttpMethodType): Record<string, string> {
  if (!isMutatingHttpMethod(method)) {
    return {};
  }

  const token = CSRF_COOKIE_NAMES.map(readCookie).find(
    (value): value is string => value !== null,
  );

  if (!token) {
    return {};
  }

  return { [CSRF_HEADER_NAME]: token };
}

function normalizeFieldErrors(errors: unknown): FieldValidationErrors {
  if (!errors || typeof errors !== "object") {
    return {};
  }

  return Object.entries(
    errors as Record<string, unknown>,
  ).reduce<FieldValidationErrors>((accumulator, [field, messages]) => {
    if (Array.isArray(messages)) {
      accumulator[field] = messages.map((message) => String(message));
    } else if (typeof messages === "string") {
      accumulator[field] = [messages];
    }

    return accumulator;
  }, {});
}

function resolveErrorMessage(
  payload: ProblemPayload | null,
  fallback: string,
): string {
  const candidate = payload?.detail ?? payload?.message ?? payload?.title;

  return typeof candidate === "string" && candidate.length > 0
    ? candidate
    : fallback;
}

async function parseResponseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    return null;
  }

  return response.json().catch(() => null);
}

export async function requestCsrfCookie(): Promise<void> {
  const origin = new URL(clientEnvironment.apiUrl).origin;

  await fetch(`${origin}/sanctum/csrf-cookie`, {
    method: HttpMethodType.GET,
    credentials: "include",
    headers: { Accept: "application/json" },
  });
}

export async function requestSignedApiUrl(signedUrl: string): Promise<void> {
  const apiOrigin = new URL(clientEnvironment.apiUrl).origin;
  const target = new URL(signedUrl);

  if (target.origin !== apiOrigin) {
    throw new HttpError(
      HttpStatusType.BAD_REQUEST,
      "URL de verificação inválida.",
    );
  }

  const response = await fetch(target.toString(), {
    method: HttpMethodType.GET,
    credentials: "include",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    const payload = (await parseResponseBody(
      response,
    )) as ProblemPayload | null;
    throw new HttpError(
      response.status,
      resolveErrorMessage(payload, "Não foi possível verificar o e-mail."),
      {
        payload,
        requestId: response.headers.get(REQUEST_ID_HEADER),
      },
    );
  }
}

export async function apiClient<TResponse = unknown>({
  url,
  method = HttpMethodType.GET,
  body,
  headers = {},
  errorMessage = "Erro ao processar a requisição.",
}: ApiClientOptions): Promise<TResponse> {
  const isFormData = body instanceof FormData;
  const requestId = generateRequestId();

  const response = await fetch(`${clientEnvironment.apiUrl}${url}`, {
    method,
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...buildCsrfHeaders(method),
      ...(requestId ? { [REQUEST_ID_HEADER]: requestId } : {}),
      ...headers,
    },
    body:
      body === undefined
        ? null
        : isFormData
          ? (body as FormData)
          : JSON.stringify(body),
  });

  const payload = (await parseResponseBody(response)) as ProblemPayload | null;

  if (!response.ok) {
    const message = resolveErrorMessage(payload, errorMessage);
    const errorOptions = {
      payload,
      requestId: response.headers.get(REQUEST_ID_HEADER) ?? requestId,
      retryAfterSeconds: parseRetryAfterSeconds(response),
    };

    if (response.status === HttpStatusType.UNPROCESSABLE_ENTITY) {
      throw new FormValidationHttpError(
        response.status,
        message,
        normalizeFieldErrors(payload?.errors),
        errorOptions,
      );
    }

    throw new HttpError(response.status, message, errorOptions);
  }

  return (payload ?? {}) as TResponse;
}

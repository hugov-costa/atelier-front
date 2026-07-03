export interface HttpErrorOptions {
  payload?: unknown;
  requestId?: string | null;
  retryAfterSeconds?: number | null;
}

export class HttpError extends Error {
  readonly status: number;
  readonly payload?: unknown;
  readonly requestId: string | null;
  readonly retryAfterSeconds: number | null;

  constructor(
    status: number,
    message?: string,
    options: HttpErrorOptions = {},
  ) {
    super(message ?? `HTTP ${status}`);
    this.name = "HttpError";
    this.status = status;
    this.payload = options.payload;
    this.requestId = options.requestId ?? null;
    this.retryAfterSeconds = options.retryAfterSeconds ?? null;

    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

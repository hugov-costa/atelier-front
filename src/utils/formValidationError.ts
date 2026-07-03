import { HttpError, HttpErrorOptions } from "@/utils/httpError";

export type FieldValidationErrors = Record<string, string[]>;

export class FormValidationHttpError extends HttpError {
  readonly fieldErrors: FieldValidationErrors;

  constructor(
    status: number,
    message: string,
    fieldErrors: FieldValidationErrors = {},
    options: HttpErrorOptions = {},
  ) {
    super(status, message, options);
    this.name = "FormValidationHttpError";
    this.fieldErrors = fieldErrors;

    Object.setPrototypeOf(this, FormValidationHttpError.prototype);
  }
}

export function isFormValidationHttpError(
  error: unknown,
): error is FormValidationHttpError {
  return error instanceof FormValidationHttpError;
}

export interface ErrorContext {
  source: string;
  requestId?: string | null;
  digest?: string;
}

export interface ErrorReporter {
  report(error: unknown, context: ErrorContext): void;
}

const consoleReporter: ErrorReporter = {
  report(error, context) {
    if (process.env.NODE_ENV !== "production") {
      console.error(`[${context.source}]`, error, context);
    }
  },
};

let activeReporter: ErrorReporter = consoleReporter;

export function setErrorReporter(reporter: ErrorReporter): void {
  activeReporter = reporter;
}

export function captureError(error: unknown, context: ErrorContext): void {
  try {
    activeReporter.report(error, context);
  } catch (reporterError) {
    if (process.env.NODE_ENV !== "production") {
      console.error(
        "Error reporter threw while handling an error.",
        reporterError,
      );
    }
  }
}

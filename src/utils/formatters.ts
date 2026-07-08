const EMPTY_VALUE = "—";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  currency: "BRL",
  style: "currency",
});

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeZone: "UTC",
});

const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

const dateTimeUtcFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "UTC",
});

const decimalFormatter = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 2,
});

export function centsFromCurrencyInput(value: number): number {
  return Math.round(value * 100);
}

export function currencyInputFromCents(cents?: number | null): number {
  if (cents === undefined || cents === null) {
    return 0;
  }

  return cents / 100;
}

export function maskCurrencyInput(raw: string): string {
  const digits = raw.replace(/\D/g, "");

  if (digits === "") {
    return "";
  }

  const cents = Number(digits);
  const reais = Math.floor(cents / 100);
  const centavos = String(cents % 100).padStart(2, "0");

  return `${reais},${centavos}`;
}

export function centsFromMaskedInput(value: string): number {
  const digits = value.replace(/\D/g, "");

  return digits === "" ? 0 : Number(digits);
}

export function maskedInputFromCents(cents?: number | null): string {
  if (cents === undefined || cents === null) {
    return "";
  }

  return maskCurrencyInput(String(Math.round(cents)));
}

export function formatCurrencyFromCents(cents?: number | null): string {
  if (cents === undefined || cents === null) {
    return EMPTY_VALUE;
  }

  return currencyFormatter.format(cents / 100);
}

export function formatDate(value?: string | null): string {
  if (!value) {
    return EMPTY_VALUE;
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return EMPTY_VALUE;
  }

  return dateFormatter.format(parsedDate);
}

export function formatDateTime(value?: string | null): string {
  if (!value) {
    return EMPTY_VALUE;
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return EMPTY_VALUE;
  }

  return dateTimeFormatter.format(parsedDate);
}

export function formatDateTimeUtc(value?: string | null): string {
  if (!value) {
    return EMPTY_VALUE;
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return EMPTY_VALUE;
  }

  return dateTimeUtcFormatter.format(parsedDate);
}

export function datetimeInputFromApi(value?: string | null): string {
  if (!value) {
    return "";
  }

  return value.replace(" ", "T").slice(0, 16);
}

export function datetimeInputToApi(value: string): string {
  if (!value) {
    return value;
  }

  const normalized = value.replace("T", " ");

  return normalized.length === 16 ? `${normalized}:00` : normalized;
}

export function formatTime(value?: string | null): string {
  if (!value) {
    return EMPTY_VALUE;
  }

  return value.slice(0, 5);
}

export function timeInputFromApi(value?: string | null): string {
  if (!value) {
    return "";
  }

  return value.slice(0, 5);
}

export function timeInputToApi(value: string): string {
  if (!value) {
    return value;
  }

  return value.length === 5 ? `${value}:00` : value;
}

export function formatDecimal(value?: string | number | null): string {
  if (value === undefined || value === null || value === "") {
    return EMPTY_VALUE;
  }

  const parsed = typeof value === "number" ? value : Number(value);

  if (Number.isNaN(parsed)) {
    return EMPTY_VALUE;
  }

  return decimalFormatter.format(parsed);
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "?";
  }

  const firstInitial = parts[0]?.charAt(0) ?? "";
  const lastInitial =
    parts.length > 1 ? (parts[parts.length - 1]?.charAt(0) ?? "") : "";

  return `${firstInitial}${lastInitial}`.toUpperCase();
}

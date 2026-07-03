const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

export function formatDateTime(value?: string | null): string {
  if (!value) {
    return "—";
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return dateTimeFormatter.format(parsedDate);
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

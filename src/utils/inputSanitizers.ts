export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

export function decimalOnly(value: string): string {
  const cleaned = value.replace(/[^\d.]/g, "");
  const [integerPart, ...fractionParts] = cleaned.split(".");

  if (fractionParts.length === 0) {
    return integerPart;
  }

  return `${integerPart}.${fractionParts.join("")}`;
}

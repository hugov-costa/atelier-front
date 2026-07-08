export type ListParams = {
  direction?: "asc" | "desc";
  page?: number;
  perPage?: number;
  search?: string;
  sort?: string;
};

type QueryValue = boolean | number | string | null | undefined;

const parameterNameOverrides: Record<string, string> = {
  perPage: "per_page",
};

export function buildListQuery(params: Record<string, QueryValue>): string {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") {
      continue;
    }

    searchParams.set(parameterNameOverrides[key] ?? key, String(value));
  }

  const query = searchParams.toString();

  return query ? `?${query}` : "";
}

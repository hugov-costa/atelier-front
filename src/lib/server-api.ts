import { cookies } from "next/headers";

import { getServerEnvironment } from "@/lib/env";

export class ServerApiError extends Error {
  constructor(public readonly status: number) {
    super(`Server API request failed with status ${status}.`);
    this.name = "ServerApiError";
  }
}

export async function serverApiGet<TResponse>(
  path: string,
): Promise<TResponse> {
  const { apiUrlServer } = getServerEnvironment();
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  const response = await fetch(`${apiUrlServer}${path}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Cookie: cookieHeader,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new ServerApiError(response.status);
  }

  return (await response.json()) as TResponse;
}

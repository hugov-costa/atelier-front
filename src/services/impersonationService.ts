import { z } from "zod";

import { apiClient } from "@/lib/api-client";
import {
  impersonationResponseSchema,
  parseApiResponse,
} from "@/lib/responseSchemas";
import { HttpMethodType } from "@/types/httpMethod";

export type StartImpersonationResponse = z.infer<
  typeof impersonationResponseSchema
>;

export async function startImpersonation(
  userId: string,
  reason: string,
): Promise<StartImpersonationResponse> {
  const response = await apiClient<StartImpersonationResponse>({
    url: `/users/${userId}/impersonate`,
    method: HttpMethodType.POST,
    body: { reason },
    errorMessage: "Erro ao iniciar a personificação.",
  });

  return parseApiResponse(impersonationResponseSchema, response);
}

export async function stopImpersonation(): Promise<void> {
  await apiClient<void>({
    url: "/impersonate",
    method: HttpMethodType.DELETE,
    errorMessage: "Erro ao encerrar a personificação.",
  });
}

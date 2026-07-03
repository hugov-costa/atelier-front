import { User } from "@/interfaces/user";
import { apiClient } from "@/lib/api-client";
import { HttpMethodType } from "@/types/httpMethod";

export interface StartImpersonationResponse {
  data: {
    user: User;
    expires_at: string;
  };
}

export async function startImpersonation(
  userId: string,
  reason: string,
): Promise<StartImpersonationResponse> {
  return apiClient<StartImpersonationResponse>({
    url: `/users/${userId}/impersonate`,
    method: HttpMethodType.POST,
    body: { reason },
    errorMessage: "Erro ao iniciar a personificação.",
  });
}

export async function stopImpersonation(): Promise<void> {
  await apiClient<void>({
    url: "/impersonate",
    method: HttpMethodType.DELETE,
    errorMessage: "Erro ao encerrar a personificação.",
  });
}

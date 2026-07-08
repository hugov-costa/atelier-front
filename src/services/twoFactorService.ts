import { MessageResponse } from "@/interfaces/authResponse";
import {
  ConfirmTwoFactorPayload,
  TwoFactorRecoveryCodesResponse,
  TwoFactorSetupResponse,
} from "@/interfaces/twoFactor";
import { apiClient } from "@/lib/api-client";
import {
  parseApiResponse,
  resourceSchema,
  twoFactorRecoveryCodesResponseSchema,
  twoFactorSetupResponseSchema,
} from "@/lib/responseSchemas";
import { HttpMethodType } from "@/types/httpMethod";

export async function enableTwoFactor(): Promise<TwoFactorSetupResponse> {
  const response = await apiClient<unknown>({
    url: "/two-factor/enable",
    method: HttpMethodType.POST,
    errorMessage: "Erro ao habilitar a autenticação em dois fatores.",
  });

  return parseApiResponse(
    resourceSchema(twoFactorSetupResponseSchema),
    response,
  );
}

export async function confirmTwoFactor(
  payload: ConfirmTwoFactorPayload,
): Promise<MessageResponse> {
  return apiClient<MessageResponse>({
    url: "/two-factor/confirm",
    method: HttpMethodType.POST,
    body: payload,
    errorMessage: "Erro ao confirmar a autenticação em dois fatores.",
  });
}

export async function regenerateRecoveryCodes(
  password: string,
): Promise<TwoFactorRecoveryCodesResponse> {
  const response = await apiClient<unknown>({
    url: "/two-factor/recovery-codes",
    method: HttpMethodType.POST,
    body: { password },
    errorMessage: "Erro ao gerar novos códigos de recuperação.",
  });

  return parseApiResponse(
    resourceSchema(twoFactorRecoveryCodesResponseSchema),
    response,
  );
}

export async function disableTwoFactor(
  password: string,
): Promise<MessageResponse> {
  return apiClient<MessageResponse>({
    url: "/two-factor",
    method: HttpMethodType.DELETE,
    body: { password },
    errorMessage: "Erro ao desabilitar a autenticação em dois fatores.",
  });
}

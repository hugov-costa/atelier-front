import { MessageResponse } from "@/interfaces/authResponse";
import {
  SettingsResourceResponse,
  UpdateSettingsPayload,
} from "@/interfaces/settings";
import { apiClient } from "@/lib/api-client";
import {
  parseApiResponse,
  resourceSchema,
  settingResponseSchema,
} from "@/lib/responseSchemas";
import { HttpMethodType } from "@/types/httpMethod";

export async function getSettings(): Promise<SettingsResourceResponse> {
  const response = await apiClient<SettingsResourceResponse>({
    url: "/settings",
    method: HttpMethodType.GET,
    errorMessage: "Erro ao carregar as configurações.",
  });

  return parseApiResponse(resourceSchema(settingResponseSchema), response);
}

export async function updateSettings(
  payload: UpdateSettingsPayload,
): Promise<SettingsResourceResponse> {
  const response = await apiClient<SettingsResourceResponse>({
    url: "/settings",
    method: HttpMethodType.PUT,
    body: payload,
    errorMessage: "Erro ao salvar as configurações.",
  });

  return parseApiResponse(resourceSchema(settingResponseSchema), response);
}

export async function uploadLogo(
  file: File,
): Promise<SettingsResourceResponse> {
  const formData = new FormData();
  formData.append("logo", file);

  const response = await apiClient<SettingsResourceResponse>({
    url: "/settings/logo",
    method: HttpMethodType.POST,
    body: formData,
    errorMessage: "Erro ao enviar a logo.",
  });

  return parseApiResponse(resourceSchema(settingResponseSchema), response);
}

export async function deleteLogo(): Promise<MessageResponse> {
  return apiClient<MessageResponse>({
    url: "/settings/logo",
    method: HttpMethodType.DELETE,
    errorMessage: "Erro ao remover a logo.",
  });
}

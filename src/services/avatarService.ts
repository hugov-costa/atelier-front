import { MessageResponse } from "@/interfaces/authResponse";
import { GetUserResponse } from "@/interfaces/userResponse";
import { apiClient } from "@/lib/api-client";
import {
  parseApiResponse,
  resourceSchema,
  userResponseSchema,
} from "@/lib/responseSchemas";
import { HttpMethodType } from "@/types/httpMethod";

export async function uploadAvatar(
  userId: string,
  file: File,
): Promise<GetUserResponse> {
  const formData = new FormData();
  formData.append("avatar", file);

  const response = await apiClient<GetUserResponse>({
    url: `/users/${userId}/avatar`,
    method: HttpMethodType.POST,
    body: formData,
    errorMessage: "Erro ao enviar a imagem de perfil.",
  });

  parseApiResponse(resourceSchema(userResponseSchema), response);

  return response;
}

export async function deleteAvatar(userId: string): Promise<MessageResponse> {
  return apiClient<MessageResponse>({
    url: `/users/${userId}/avatar`,
    method: HttpMethodType.DELETE,
    errorMessage: "Erro ao remover a imagem de perfil.",
  });
}

import { LoginResponse, MessageResponse } from "@/interfaces/authResponse";
import { LoginCredentials } from "@/interfaces/login";
import {
  ForgotPasswordPayload,
  ResetPasswordPayload,
  UpdatePasswordPayload,
} from "@/interfaces/password";
import { RegisterPayload } from "@/interfaces/register";
import { User } from "@/interfaces/user";
import {
  apiClient,
  requestCsrfCookie,
  requestSignedApiUrl,
} from "@/lib/api-client";
import {
  loginResponseSchema,
  parseApiResponse,
  userResponseSchema,
} from "@/lib/responseSchemas";
import { HttpMethodType } from "@/types/httpMethod";

function isResourceResponse(value: unknown): value is { data: User } {
  return (
    typeof value === "object" &&
    value !== null &&
    "data" in value &&
    typeof (value as { data: unknown }).data === "object"
  );
}

export async function register(
  payload: RegisterPayload,
): Promise<MessageResponse> {
  await requestCsrfCookie();

  return apiClient<MessageResponse>({
    url: "/register",
    method: HttpMethodType.POST,
    body: payload,
    errorMessage: "Erro ao registrar usuário.",
  });
}

export async function login(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  await requestCsrfCookie();

  const response = await apiClient<LoginResponse>({
    url: "/login",
    method: HttpMethodType.POST,
    body: credentials,
    errorMessage: "Erro ao realizar login.",
  });

  return parseApiResponse(loginResponseSchema, response);
}

export async function logout(): Promise<MessageResponse> {
  return apiClient<MessageResponse>({
    url: "/logout",
    method: HttpMethodType.POST,
    errorMessage: "Erro ao realizar logout.",
  });
}

export async function getCurrentUser(): Promise<User> {
  const response = await apiClient<{ data: User } | User>({
    url: "/user",
    method: HttpMethodType.GET,
    errorMessage: "Erro ao buscar o usuário autenticado.",
  });

  const user = isResourceResponse(response) ? response.data : response;

  return parseApiResponse(userResponseSchema, user);
}

export async function updatePassword(
  payload: UpdatePasswordPayload,
): Promise<MessageResponse> {
  return apiClient<MessageResponse>({
    url: "/user/password",
    method: HttpMethodType.PUT,
    body: payload,
    errorMessage: "Erro ao alterar a senha.",
  });
}

export async function forgotPassword(
  payload: ForgotPasswordPayload,
): Promise<MessageResponse> {
  await requestCsrfCookie();

  return apiClient<MessageResponse>({
    url: "/forgot-password",
    method: HttpMethodType.POST,
    body: payload,
    errorMessage: "Erro ao solicitar a redefinição de senha.",
  });
}

export async function resetPassword(
  payload: ResetPasswordPayload,
): Promise<MessageResponse> {
  await requestCsrfCookie();

  return apiClient<MessageResponse>({
    url: "/reset-password",
    method: HttpMethodType.POST,
    body: payload,
    errorMessage: "Erro ao redefinir a senha.",
  });
}

export async function resendVerificationEmail(): Promise<MessageResponse> {
  return apiClient<MessageResponse>({
    url: "/email/verification-notification",
    method: HttpMethodType.POST,
    errorMessage: "Erro ao reenviar o e-mail de verificação.",
  });
}

export async function verifyEmail(signedUrl: string): Promise<void> {
  await requestSignedApiUrl(signedUrl);
}

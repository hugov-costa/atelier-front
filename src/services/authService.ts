import { LoginResponse, MessageResponse } from "@/interfaces/authResponse";
import { LoginCredentials } from "@/interfaces/login";
import {
  ConfirmSetPasswordPayload,
  DeleteAccountPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  SetPasswordLinkPayload,
  UpdatePasswordPayload,
  ValidateSetPasswordTokenPayload,
} from "@/interfaces/password";
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

export async function login(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  await requestCsrfCookie();

  const body: LoginCredentials = {
    email: credentials.email,
    password: credentials.password,
  };

  if (credentials.code) {
    body.code = credentials.code;
  }

  const response = await apiClient<LoginResponse>({
    url: "/login",
    method: HttpMethodType.POST,
    body,
    errorMessage: "Erro ao realizar login.",
  });

  return parseApiResponse(loginResponseSchema, response);
}

export async function logout(): Promise<void> {
  await apiClient<void>({
    url: "/logout",
    method: HttpMethodType.POST,
    errorMessage: "Erro ao realizar logout.",
  });
}

export async function getCurrentUser(): Promise<User> {
  const response = await apiClient<{ data: User }>({
    url: "/user",
    method: HttpMethodType.GET,
    errorMessage: "Erro ao buscar o usuário autenticado.",
  });

  return parseApiResponse(userResponseSchema, response.data);
}

export async function deleteAccount(
  payload: DeleteAccountPayload,
): Promise<void> {
  await apiClient<void>({
    url: "/user",
    method: HttpMethodType.DELETE,
    body: payload,
    errorMessage: "Erro ao eliminar a conta.",
  });
}

export async function exportAccountData(): Promise<unknown> {
  return apiClient<unknown>({
    url: "/user/export",
    method: HttpMethodType.GET,
    errorMessage: "Erro ao exportar os dados da conta.",
  });
}

export async function updatePassword(
  payload: UpdatePasswordPayload,
): Promise<void> {
  await apiClient<void>({
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

export async function sendSetPasswordLink(
  payload: SetPasswordLinkPayload,
): Promise<void> {
  await requestCsrfCookie();

  await apiClient<void>({
    url: "/set-password/request",
    method: HttpMethodType.POST,
    body: payload,
    errorMessage: "Erro ao solicitar o link de definição de senha.",
  });
}

export async function validateSetPasswordToken(
  payload: ValidateSetPasswordTokenPayload,
): Promise<void> {
  await requestCsrfCookie();

  await apiClient<void>({
    url: "/set-password/validate-token",
    method: HttpMethodType.POST,
    body: payload,
    errorMessage: "Link de definição de senha inválido ou expirado.",
  });
}

export async function confirmSetPassword(
  payload: ConfirmSetPasswordPayload,
): Promise<void> {
  await requestCsrfCookie();

  await apiClient<void>({
    url: "/set-password/confirm",
    method: HttpMethodType.POST,
    body: payload,
    errorMessage: "Erro ao definir a senha.",
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

export interface DeleteAccountPayload {
  password: string;
}

export interface UpdatePasswordPayload {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface SetPasswordLinkPayload {
  email: string;
}

export interface ValidateSetPasswordTokenPayload {
  email: string;
  token: string;
}

export interface ConfirmSetPasswordPayload {
  email: string;
  password: string;
  password_confirmation: string;
  token: string;
}

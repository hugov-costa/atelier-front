import { ResourceResponse } from "@/interfaces/authResponse";

export interface TwoFactorSetup {
  secret: string;
  qr_code_url: string;
  recovery_codes: string[];
}

export type TwoFactorSetupResponse = ResourceResponse<TwoFactorSetup>;

export interface TwoFactorRecoveryCodes {
  recovery_codes: string[];
}

export type TwoFactorRecoveryCodesResponse =
  ResourceResponse<TwoFactorRecoveryCodes>;

export interface ConfirmTwoFactorPayload {
  code: string;
}

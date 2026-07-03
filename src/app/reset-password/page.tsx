import { Suspense } from "react";

import { ResetPasswordForm } from "@/app/reset-password/_components/reset-password-form";
import { AuthLocaleControl } from "@/components/auth-locale-control";

export default function ResetPasswordPage() {
  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <AuthLocaleControl />
      <Suspense fallback={null}>
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}

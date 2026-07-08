import { Suspense } from "react";

import { SetPasswordForm } from "@/app/set-password/_components/set-password-form";
import { AuthLocaleControl } from "@/components/auth-locale-control";

export default function SetPasswordPage() {
  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <AuthLocaleControl />
      <Suspense fallback={null}>
        <SetPasswordForm />
      </Suspense>
    </main>
  );
}

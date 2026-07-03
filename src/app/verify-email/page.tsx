import { Suspense } from "react";

import { VerifyEmailHandler } from "@/app/verify-email/_components/verify-email-handler";
import { AuthLocaleControl } from "@/components/auth-locale-control";

export default function VerifyEmailPage() {
  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <AuthLocaleControl />
      <Suspense fallback={null}>
        <VerifyEmailHandler />
      </Suspense>
    </main>
  );
}

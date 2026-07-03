"use client";

import { useTranslations } from "next-intl";
import { ReactNode } from "react";

import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { EmailVerificationBanner } from "@/components/email-verification-banner";
import { ImpersonationBanner } from "@/components/impersonation-banner";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export function AuthenticatedShell({ children }: { children: ReactNode }) {
  const t = useTranslations();
  useCurrentUser();

  return (
    <SidebarProvider>
      <a
        href="#main-content"
        className="bg-background focus:ring-ring sr-only z-50 rounded-md px-3 py-2 shadow focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:ring-2"
      >
        {t("skipToContent")}
      </a>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumbs />
          <div className="ml-auto flex items-center gap-1">
            <LocaleSwitcher />
            <ThemeToggle />
          </div>
        </header>
        <main
          id="main-content"
          tabIndex={-1}
          className="flex flex-1 flex-col gap-6 p-6 outline-none"
        >
          <ImpersonationBanner />
          <EmailVerificationBanner />
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

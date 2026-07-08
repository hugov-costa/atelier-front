"use client";

import { NextIntlClientProvider } from "next-intl";
import { ReactNode } from "react";

import { QueryProvider } from "@/components/query-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserProvider } from "@/contexts/user-context";
import { Locale, Messages } from "@/i18n/config";
import { User } from "@/interfaces/user";

interface ProvidersProps {
  children: ReactNode;
  locale: Locale;
  messages: Messages;
  nonce?: string;
  initialUser?: User | null;
}

export function Providers({
  children,
  locale,
  messages,
  nonce,
  initialUser,
}: ProvidersProps) {
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      timeZone="America/Sao_Paulo"
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        nonce={nonce}
      >
        <QueryProvider>
          <UserProvider initialUser={initialUser}>
            <TooltipProvider delayDuration={200}>
              {children}
              <Toaster richColors position="top-right" />
            </TooltipProvider>
          </UserProvider>
        </QueryProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}

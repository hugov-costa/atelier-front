import type { Metadata } from "next";
import { Fraunces, Geist_Mono, Nunito_Sans } from "next/font/google";
import { headers } from "next/headers";
import { getLocale } from "next-intl/server";

import { Providers } from "@/components/providers";
import { messagesByLocale, resolveLocale } from "@/i18n/config";

import "./globals.css";

const bodySans = Nunito_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const headingSerif = Fraunces({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const monoFont = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Serv Front",
  description: "Painel administrativo integrado à API atelier.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = resolveLocale(await getLocale());
  const messages = messagesByLocale[locale];
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${bodySans.variable} ${headingSerif.variable} ${monoFont.variable} h-full antialiased`}
    >
      <body className="bg-background text-foreground flex min-h-full flex-col">
        <Providers locale={locale} messages={messages} nonce={nonce}>
          {children}
        </Providers>
      </body>
    </html>
  );
}

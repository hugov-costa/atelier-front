"use client";

import { Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Locale, localeLabels, locales, resolveLocale } from "@/i18n/config";
import { setLocale } from "@/i18n/setLocale";

export function LocaleSwitcher() {
  const t = useTranslations("language");
  const activeLocale = resolveLocale(useLocale());
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSelect(value: string) {
    const nextLocale = resolveLocale(value);
    if (nextLocale === activeLocale) {
      return;
    }

    startTransition(async () => {
      await setLocale(nextLocale);
      router.refresh();
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={t("label")}
          disabled={isPending}
        >
          <Languages className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={activeLocale}
          onValueChange={handleSelect}
        >
          {locales.map((locale: Locale) => (
            <DropdownMenuRadioItem key={locale} value={locale}>
              {localeLabels[locale]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

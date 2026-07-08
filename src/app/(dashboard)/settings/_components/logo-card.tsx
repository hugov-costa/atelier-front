"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRef } from "react";

import { useLogo } from "@/app/(dashboard)/settings/_hooks/useLogo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Settings } from "@/interfaces/settings";

export function LogoCard({ settings }: { settings: Settings }) {
  const t = useTranslations("settings");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { removeMutation, uploadMutation } = useLogo();

  const isBusy = uploadMutation.isPending || removeMutation.isPending;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("logoTitle")}</CardTitle>
        <CardDescription>{t("logoDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center gap-6">
        <div className="bg-muted text-muted-foreground relative flex h-20 w-32 items-center justify-center overflow-hidden rounded-md text-xs">
          {settings.logo_url ? (
            <Image
              src={settings.logo_url}
              alt={t("logoAlt")}
              fill
              sizes="128px"
              className="object-contain"
            />
          ) : (
            t("logoEmpty")
          )}
        </div>

        <div className="flex flex-col gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                uploadMutation.mutate(file);
              }
              event.target.value = "";
            }}
          />
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              disabled={isBusy}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploadMutation.isPending ? t("logoUploading") : t("logoUpload")}
            </Button>
            {settings.logo_url ? (
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={isBusy}
                onClick={() => removeMutation.mutate()}
              >
                {t("logoRemove")}
              </Button>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

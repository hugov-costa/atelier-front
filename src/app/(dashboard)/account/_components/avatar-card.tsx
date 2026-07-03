"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRef } from "react";

import { useAvatar } from "@/app/(dashboard)/account/_hooks/useAvatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User } from "@/interfaces/user";
import { getInitials } from "@/utils/formatters";

export function AvatarCard({ user }: { user: User }) {
  const t = useTranslations("account");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadMutation, removeMutation } = useAvatar(user.id);

  const isBusy = uploadMutation.isPending || removeMutation.isPending;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("avatarTitle")}</CardTitle>
        <CardDescription>{t("avatarDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center gap-6">
        <div className="bg-muted text-muted-foreground relative flex size-20 items-center justify-center overflow-hidden rounded-full text-lg font-medium">
          {user.avatar_url ? (
            <Image
              src={user.avatar_url}
              alt={t("avatarAlt", { name: user.name })}
              fill
              sizes="80px"
              className="object-cover"
            />
          ) : (
            getInitials(user.name)
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
              {uploadMutation.isPending
                ? t("avatarUploading")
                : t("avatarUpload")}
            </Button>
            {user.avatar_url ? (
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={isBusy}
                onClick={() => removeMutation.mutate()}
              >
                {t("avatarRemove")}
              </Button>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { queryKeys } from "@/lib/queryKeys";
import { verifyEmail } from "@/services/authService";

export function VerifyEmailHandler() {
  const t = useTranslations("auth.verifyEmail");
  const searchParams = useSearchParams();
  const signedUrl = searchParams.get("verify_url") ?? "";
  const queryClient = useQueryClient();
  const hasStarted = useRef(false);

  const verifyMutation = useMutation({
    mutationFn: () => verifyEmail(signedUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.currentUser });
    },
  });

  const { mutate } = verifyMutation;

  useEffect(() => {
    if (!hasStarted.current && signedUrl.length > 0) {
      hasStarted.current = true;
      mutate();
    }
  }, [mutate, signedUrl]);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>
          {signedUrl.length === 0 ? t("invalidLink") : t("confirming")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {verifyMutation.isPending ? (
          <p className="text-muted-foreground text-sm">{t("verifying")}</p>
        ) : null}

        {verifyMutation.isSuccess ? (
          <p className="text-sm">{t("success")}</p>
        ) : null}

        {verifyMutation.isError || signedUrl.length === 0 ? (
          <p className="text-muted-foreground text-sm">{t("error")}</p>
        ) : null}

        <Button asChild>
          <Link href="/">{t("goToDashboard")}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

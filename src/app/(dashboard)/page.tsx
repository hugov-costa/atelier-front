"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

import { Can } from "@/components/authorization/can";
import { PageTitle } from "@/components/page-title";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUser } from "@/contexts/user-context";

export default function DashboardHomePage() {
  const t = useTranslations("home");
  const { user } = useUser();

  return (
    <div className="space-y-8">
      <PageTitle
        title={user ? t("greeting", { name: user.name }) : t("title")}
        description={t("welcome")}
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>{t("accountTitle")}</CardTitle>
            <CardDescription>{t("accountDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/account">{t("accountAction")}</Link>
            </Button>
          </CardContent>
        </Card>

        <Can permission="users.view">
          <Card>
            <CardHeader>
              <CardTitle>{t("usersTitle")}</CardTitle>
              <CardDescription>{t("usersDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/users">{t("usersAction")}</Link>
              </Button>
            </CardContent>
          </Card>
        </Can>

        <Can permission="audits.view">
          <Card>
            <CardHeader>
              <CardTitle>{t("auditsTitle")}</CardTitle>
              <CardDescription>{t("auditsDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/audits">{t("auditsAction")}</Link>
              </Button>
            </CardContent>
          </Card>
        </Can>
      </div>
    </div>
  );
}

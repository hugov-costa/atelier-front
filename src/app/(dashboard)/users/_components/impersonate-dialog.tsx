"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { UserRoundCog } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useImpersonation } from "@/hooks/useImpersonation";
import { User } from "@/interfaces/user";

export function ImpersonateDialog({ user }: { user: User }) {
  const t = useTranslations("impersonation");
  const common = useTranslations("common");
  const { startMutation } = useImpersonation();
  const [reason, setReason] = useState("");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <UserRoundCog className="size-4" />
          {t("action")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("dialogTitle", { name: user.name })}</DialogTitle>
          <DialogDescription>{t("dialogDescription")}</DialogDescription>
        </DialogHeader>

        <Field>
          <FieldLabel htmlFor="impersonationReason">
            {t("reasonLabel")}
          </FieldLabel>
          <Textarea
            id="impersonationReason"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder={t("reasonPlaceholder")}
          />
        </Field>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              {common("cancel")}
            </Button>
          </DialogClose>
          <Button
            type="button"
            disabled={startMutation.isPending || reason.trim().length < 3}
            onClick={() =>
              startMutation.mutate({ userId: user.id, reason: reason.trim() })
            }
          >
            {startMutation.isPending ? t("starting") : t("confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

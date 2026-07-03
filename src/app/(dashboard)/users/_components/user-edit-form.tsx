"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { useUpdateUserMutation } from "@/app/(dashboard)/users/_hooks/useUpdateUserMutation";
import {
  createUserSchema,
  UserFormValues,
} from "@/app/(dashboard)/users/_schemas/userSchema";
import { Form } from "@/components/form/form";
import { FormInput } from "@/components/form/form-fields";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { User } from "@/interfaces/user";

export function UserEditForm({ user }: { user: User }) {
  const t = useTranslations("users");
  const common = useTranslations("common");
  const validation = useTranslations("validation");
  const router = useRouter();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(createUserSchema(validation)),
    defaultValues: {
      name: user.name,
      email: user.email,
    },
  });

  const updateUserMutation = useUpdateUserMutation({
    userId: user.id,
    setError: form.setError,
    onUpdated: () => {
      router.push("/users");
    },
  });

  const isSubmitting = updateUserMutation.isPending;

  return (
    <Form
      form={form}
      onSubmit={(values) => updateUserMutation.mutate(values)}
      className="max-w-md"
    >
      <FieldGroup>
        <FormInput
          name="name"
          label={t("columnName")}
          disabled={isSubmitting}
        />
        <FormInput
          name="email"
          label={t("columnEmail")}
          type="email"
          disabled={isSubmitting}
        />
        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? common("saving") : common("save")}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => router.push("/users")}
          >
            {common("cancel")}
          </Button>
        </div>
      </FieldGroup>
    </Form>
  );
}

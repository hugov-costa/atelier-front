"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import {
  createRegisterSchema,
  RegisterFormValues,
} from "@/app/register/_schemas/registerSchema";

export function useRegisterForm() {
  const t = useTranslations("validation");

  return useForm<RegisterFormValues>({
    resolver: zodResolver(createRegisterSchema(t)),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });
}

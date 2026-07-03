"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import {
  createLoginSchema,
  LoginFormValues,
} from "@/app/login/_schemas/loginSchema";

export function useLoginForm() {
  const t = useTranslations("validation");

  return useForm<LoginFormValues>({
    resolver: zodResolver(createLoginSchema(t)),
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
  });
}

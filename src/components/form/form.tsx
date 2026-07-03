"use client";

import { ComponentProps, ReactNode } from "react";
import { FieldValues, FormProvider, UseFormReturn } from "react-hook-form";

interface FormProps<TFieldValues extends FieldValues> extends Omit<
  ComponentProps<"form">,
  "onSubmit"
> {
  form: UseFormReturn<TFieldValues>;
  onSubmit: (values: TFieldValues) => void;
  children: ReactNode;
}

export function Form<TFieldValues extends FieldValues>({
  form,
  onSubmit,
  children,
  ...props
}: FormProps<TFieldValues>) {
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate {...props}>
        {children}
      </form>
    </FormProvider>
  );
}

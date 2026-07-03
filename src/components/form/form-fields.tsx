"use client";

import { ComponentProps } from "react";
import { Controller, FieldValues, useFormContext } from "react-hook-form";

import {
  Field,
  FieldError,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

interface BaseFieldProps {
  name: string;
  label: string;
  description?: string;
}

function useFieldError(name: string): string | undefined {
  const {
    formState: { errors },
  } = useFormContext<FieldValues>();
  const message = errors[name]?.message;
  return typeof message === "string" ? message : undefined;
}

function describedBy(
  name: string,
  hasError: boolean,
  hasDescription: boolean,
): string | undefined {
  const ids = [
    hasDescription ? `${name}-description` : null,
    hasError ? `${name}-error` : null,
  ].filter((id): id is string => id !== null);

  return ids.length > 0 ? ids.join(" ") : undefined;
}

export function FormInput({
  name,
  label,
  description,
  ...inputProps
}: BaseFieldProps & Omit<ComponentProps<"input">, "name">) {
  const { register } = useFormContext<FieldValues>();
  const error = useFieldError(name);

  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      <Input
        id={name}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy(
          name,
          Boolean(error),
          Boolean(description),
        )}
        {...register(name)}
        {...inputProps}
      />
      {description ? (
        <FieldDescription id={`${name}-description`}>
          {description}
        </FieldDescription>
      ) : null}
      <FieldError
        id={`${name}-error`}
        errors={error ? [{ message: error }] : undefined}
      />
    </Field>
  );
}

export function FormTextarea({
  name,
  label,
  description,
  ...textareaProps
}: BaseFieldProps & Omit<ComponentProps<"textarea">, "name">) {
  const { register } = useFormContext<FieldValues>();
  const error = useFieldError(name);

  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      <Textarea
        id={name}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy(
          name,
          Boolean(error),
          Boolean(description),
        )}
        {...register(name)}
        {...textareaProps}
      />
      {description ? (
        <FieldDescription id={`${name}-description`}>
          {description}
        </FieldDescription>
      ) : null}
      <FieldError
        id={`${name}-error`}
        errors={error ? [{ message: error }] : undefined}
      />
    </Field>
  );
}

interface SelectOption {
  value: string;
  label: string;
}

export function FormSelect({
  name,
  label,
  description,
  options,
  placeholder,
}: BaseFieldProps & { options: SelectOption[]; placeholder?: string }) {
  const { control } = useFormContext<FieldValues>();
  const error = useFieldError(name);

  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger
              id={name}
              aria-invalid={Boolean(error)}
              aria-describedby={describedBy(
                name,
                Boolean(error),
                Boolean(description),
              )}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {description ? (
        <FieldDescription id={`${name}-description`}>
          {description}
        </FieldDescription>
      ) : null}
      <FieldError
        id={`${name}-error`}
        errors={error ? [{ message: error }] : undefined}
      />
    </Field>
  );
}

export function FormCheckbox({ name, label, description }: BaseFieldProps) {
  const { control } = useFormContext<FieldValues>();
  const error = useFieldError(name);

  return (
    <Field orientation="horizontal" data-invalid={Boolean(error)}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Checkbox
            id={name}
            checked={Boolean(field.value)}
            onCheckedChange={field.onChange}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy(
              name,
              Boolean(error),
              Boolean(description),
            )}
          />
        )}
      />
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      {description ? (
        <FieldDescription id={`${name}-description`}>
          {description}
        </FieldDescription>
      ) : null}
      <FieldError
        id={`${name}-error`}
        errors={error ? [{ message: error }] : undefined}
      />
    </Field>
  );
}

export function FormSwitch({ name, label, description }: BaseFieldProps) {
  const { control } = useFormContext<FieldValues>();
  const error = useFieldError(name);

  return (
    <Field orientation="horizontal" data-invalid={Boolean(error)}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Switch
            id={name}
            checked={Boolean(field.value)}
            onCheckedChange={field.onChange}
            aria-describedby={describedBy(
              name,
              Boolean(error),
              Boolean(description),
            )}
          />
        )}
      />
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      {description ? (
        <FieldDescription id={`${name}-description`}>
          {description}
        </FieldDescription>
      ) : null}
      <FieldError
        id={`${name}-error`}
        errors={error ? [{ message: error }] : undefined}
      />
    </Field>
  );
}

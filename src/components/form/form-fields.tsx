"use client";

import { Info } from "lucide-react";
import { useTranslations } from "next-intl";
import { ChangeEvent, ComponentProps, useState } from "react";
import { Controller, FieldValues, useFormContext } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { maskCurrencyInput } from "@/utils/formatters";

const SEARCHABLE_THRESHOLD = 6;

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

function errorDescribedBy(name: string, hasError: boolean): string | undefined {
  return hasError ? `${name}-error` : undefined;
}

function FieldLabelWithHint({
  htmlFor,
  label,
  hint,
}: {
  htmlFor: string;
  label: string;
  hint?: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <FieldLabel htmlFor={htmlFor}>{label}</FieldLabel>
      {hint ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              aria-label={hint}
              className="text-primary/70 hover:bg-primary/10 hover:text-primary focus-visible:ring-ring inline-flex size-5 cursor-help items-center justify-center rounded-full focus-visible:ring-2 focus-visible:outline-none"
            >
              <Info className="size-4" aria-hidden="true" />
            </button>
          </TooltipTrigger>
          <TooltipContent>{hint}</TooltipContent>
        </Tooltip>
      ) : null}
    </div>
  );
}

export function FormInput({
  name,
  label,
  description,
  sanitize,
  ...inputProps
}: BaseFieldProps &
  Omit<ComponentProps<"input">, "name"> & {
    sanitize?: (value: string) => string;
  }) {
  const { register } = useFormContext<FieldValues>();
  const error = useFieldError(name);
  const registration = register(name);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (sanitize) {
      event.target.value = sanitize(event.target.value);
    }

    return registration.onChange(event);
  };

  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabelWithHint htmlFor={name} label={label} hint={description} />
      <Input
        id={name}
        aria-invalid={Boolean(error)}
        aria-describedby={errorDescribedBy(name, Boolean(error))}
        {...registration}
        {...inputProps}
        onChange={handleChange}
      />
      <FieldError
        id={`${name}-error`}
        errors={error ? [{ message: error }] : undefined}
      />
    </Field>
  );
}

export function FormCurrencyInput({
  name,
  label,
  description,
  className,
  ...inputProps
}: BaseFieldProps &
  Omit<ComponentProps<"input">, "name" | "onChange" | "inputMode">) {
  const { register } = useFormContext<FieldValues>();
  const error = useFieldError(name);
  const registration = register(name);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.target.value = maskCurrencyInput(event.target.value);

    return registration.onChange(event);
  };

  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabelWithHint htmlFor={name} label={label} hint={description} />
      <div className="relative">
        <span className="text-muted-foreground pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm">
          R$
        </span>
        <Input
          id={name}
          inputMode="numeric"
          placeholder="0,00"
          aria-invalid={Boolean(error)}
          aria-describedby={errorDescribedBy(name, Boolean(error))}
          {...registration}
          {...inputProps}
          className={cn("pl-9", className)}
          onChange={handleChange}
        />
      </div>
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
      <FieldLabelWithHint htmlFor={name} label={label} hint={description} />
      <Textarea
        id={name}
        aria-invalid={Boolean(error)}
        aria-describedby={errorDescribedBy(name, Boolean(error))}
        {...register(name)}
        {...textareaProps}
      />
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
  disabled,
  options,
  placeholder,
}: BaseFieldProps & {
  disabled?: boolean;
  options: SelectOption[];
  placeholder?: string;
}) {
  const { control } = useFormContext<FieldValues>();
  const error = useFieldError(name);

  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabelWithHint htmlFor={name} label={label} hint={description} />
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select
            value={field.value}
            onValueChange={field.onChange}
            disabled={disabled}
          >
            <SelectTrigger
              id={name}
              aria-invalid={Boolean(error)}
              aria-describedby={errorDescribedBy(name, Boolean(error))}
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
      <FieldError
        id={`${name}-error`}
        errors={error ? [{ message: error }] : undefined}
      />
    </Field>
  );
}

export function FormMultiSelect({
  name,
  label,
  description,
  emptyMessage,
  options,
}: BaseFieldProps & { emptyMessage?: string; options: SelectOption[] }) {
  const { control } = useFormContext<FieldValues>();
  const error = useFieldError(name);
  const t = useTranslations("common");
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLowerCase();
  const visibleOptions = normalizedQuery
    ? options.filter((option) =>
        option.label.toLowerCase().includes(normalizedQuery),
      )
    : options;
  const isSearchable = options.length > SEARCHABLE_THRESHOLD;

  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabelWithHint htmlFor={name} label={label} hint={description} />
      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          const selected: string[] = Array.isArray(field.value)
            ? field.value
            : [];

          const toggle = (value: string) => {
            field.onChange(
              selected.includes(value)
                ? selected.filter((item) => item !== value)
                : [...selected, value],
            );
          };

          return (
            <div className="space-y-2 rounded-md border p-3">
              {options.length === 0 ? (
                <p className="text-muted-foreground text-sm">{emptyMessage}</p>
              ) : (
                <>
                  {isSearchable ? (
                    <Input
                      type="search"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder={t("searchByName")}
                      className="h-8"
                      aria-label={t("searchByName")}
                    />
                  ) : null}
                  <div className="max-h-48 space-y-2 overflow-y-auto">
                    {visibleOptions.length === 0 ? (
                      <p className="text-muted-foreground text-sm">
                        {t("noResults")}
                      </p>
                    ) : (
                      visibleOptions.map((option) => (
                        <label
                          key={option.value}
                          className="flex items-center gap-2 text-sm"
                        >
                          <Checkbox
                            checked={selected.includes(option.value)}
                            onCheckedChange={() => toggle(option.value)}
                          />
                          {option.label}
                        </label>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>
          );
        }}
      />
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
            aria-describedby={errorDescribedBy(name, Boolean(error))}
          />
        )}
      />
      <FieldLabelWithHint htmlFor={name} label={label} hint={description} />
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
            aria-describedby={errorDescribedBy(name, Boolean(error))}
          />
        )}
      />
      <FieldLabelWithHint htmlFor={name} label={label} hint={description} />
      <FieldError
        id={`${name}-error`}
        errors={error ? [{ message: error }] : undefined}
      />
    </Field>
  );
}

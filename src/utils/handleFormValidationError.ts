import { FieldValues, Path, UseFormSetError } from "react-hook-form";

import { isFormValidationHttpError } from "@/utils/formValidationError";

export function handleFormValidationError<TFieldValues extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<TFieldValues>,
  fieldNameMap: Record<string, string> = {},
): boolean {
  if (!isFormValidationHttpError(error)) {
    return false;
  }

  Object.entries(error.fieldErrors).forEach(([serverField, messages]) => {
    const message = messages[0];
    const formField = fieldNameMap[serverField] ?? serverField;

    if (message) {
      setError(formField as Path<TFieldValues>, { type: "server", message });
    }
  });

  return Object.keys(error.fieldErrors).length > 0;
}

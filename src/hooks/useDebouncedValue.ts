"use client";

import { useEffect, useState } from "react";

const DEFAULT_DELAY_IN_MILLISECONDS = 400;

export function useDebouncedValue<TValue>(
  value: TValue,
  delayInMilliseconds: number = DEFAULT_DELAY_IN_MILLISECONDS,
): TValue {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, delayInMilliseconds);

    return () => clearTimeout(timeoutId);
  }, [value, delayInMilliseconds]);

  return debouncedValue;
}

"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/queryKeys";
import { getSettings } from "@/services/settingsService";

interface UseSettingsOptions {
  enabled?: boolean;
}

export function useSettings(options: UseSettingsOptions = {}) {
  return useQuery({
    queryKey: queryKeys.settings,
    queryFn: () => getSettings(),
    enabled: options.enabled ?? true,
  });
}

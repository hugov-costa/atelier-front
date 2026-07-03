import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useListController } from "@/hooks/useListController";

describe("useListController", () => {
  it("starts on the first page and honors the initial sort", () => {
    const { result } = renderHook(() =>
      useListController({
        perPage: 10,
        initialSort: { key: "created_at", direction: "desc" },
      }),
    );

    expect(result.current.page).toBe(1);
    expect(result.current.perPage).toBe(10);
    expect(result.current.sort).toEqual({
      key: "created_at",
      direction: "desc",
    });
  });

  it("resets to the first page when the search term changes", () => {
    const { result } = renderHook(() => useListController({ perPage: 10 }));

    act(() => result.current.setPage(3));
    expect(result.current.page).toBe(3);

    act(() => result.current.onSearchChange("john"));
    expect(result.current.page).toBe(1);
    expect(result.current.search).toBe("john");
  });

  it("toggles the direction when sorting by the active key and resets the page", () => {
    const { result } = renderHook(() => useListController({ perPage: 10 }));

    act(() => result.current.onSortChange("name"));
    expect(result.current.sort).toEqual({ key: "name", direction: "asc" });

    act(() => result.current.setPage(2));
    act(() => result.current.onSortChange("name"));

    expect(result.current.sort).toEqual({ key: "name", direction: "desc" });
    expect(result.current.page).toBe(1);
  });

  it("switches to a new key with ascending direction", () => {
    const { result } = renderHook(() => useListController({ perPage: 10 }));

    act(() => result.current.onSortChange("name"));
    act(() => result.current.onSortChange("email"));

    expect(result.current.sort).toEqual({ key: "email", direction: "asc" });
  });
});

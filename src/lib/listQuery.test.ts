import { describe, expect, it } from "vitest";

import { buildListQuery } from "@/lib/listQuery";

describe("buildListQuery", () => {
  it("retorna uma string vazia quando não há parâmetros úteis", () => {
    expect(buildListQuery({})).toBe("");
    expect(buildListQuery({ search: "", page: undefined })).toBe("");
  });

  it("mapeia perPage para per_page e ignora valores vazios", () => {
    expect(buildListQuery({ page: 2, perPage: 15, search: "" })).toBe(
      "?page=2&per_page=15",
    );
  });

  it("serializa filtros arbitrários preservando o nome do parâmetro", () => {
    expect(
      buildListQuery({ status: "unpaid", material_type: "clay", page: 1 }),
    ).toBe("?status=unpaid&material_type=clay&page=1");
  });

  it("converte booleanos e números em texto", () => {
    expect(buildListQuery({ is_recurrent: true, reference_year: 2026 })).toBe(
      "?is_recurrent=true&reference_year=2026",
    );
  });
});

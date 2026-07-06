# Referência para LLMs — serv_front

Guia de padrões de código com import paths exatos para consulta rápida.
Mantenha este arquivo atualizado conforme o projeto evolui.

---

## 1. Stack

| Camada          | Tecnologia                        |
| --------------- | --------------------------------- |
| Framework       | Next.js 16 (App Router, Turbopack)|
| React           | 19                                |
| CSS             | Tailwind CSS v4                   |
| UI Kit          | shadcn/ui (Radix)                 |
| Server state    | @tanstack/react-query v5          |
| Forms           | react-hook-form + zod v4          |
| i18n            | next-intl                         |
| Theme           | next-themes                       |
| Notifications   | sonner                            |
| Test unitário   | Vitest + Testing Library          |
| Test e2e        | Playwright                        |
| Lint/Format     | ESLint + Prettier                 |

---

## 2. Estrutura de diretórios

```
src/
  proxy.ts                      # Guarda de rotas (middleware)
  app/
    config/routes.ts            # Rotas públicas/protegidas
    layout.tsx                  # Layout raiz
    (dashboard)/layout.tsx      # Shell autenticado (sidebar + header)
    (dashboard)/<feature>/
      page.tsx                  # Página (server component, prefetch)
      _hooks/                   # Hooks TanStack Query
      _schemas/                 # Schemas zod do formulário
      _components/              # Componentes da feature
      _assets/columnDefs.tsx    # Colunas de tabela
  components/
    ui/                         # shadcn/ui (button, input, dialog, etc.)
    form/                       # Form kit (Form, FormInput, etc.)
    data-table/                 # DataTable genérico + PaginationControls
    authorization/              # Can, RequirePermission
    dashboard/                  # App shell
    states/                     # EmptyState, ErrorState
    providers.tsx               # Providers aninhados
  config/navigation.ts          # Sidebar items
  contexts/user-context.tsx     # Contexto do usuário
  hooks/                        # Hooks transversais
  i18n/                         # next-intl
  interfaces/                   # Tipos/contratos
  lib/                          # api-client, env, auth, responseSchemas
  services/                     # Camada HTTP (chama apiClient)
  types/                        # Enums HTTP
  utils/                        # formatters, httpError, validation
```

---

## 3. Import paths (atalho `@/`)

```typescript
import { apiClient } from "@/lib/api-client";
import { clientEnvironment } from "@/lib/env";
import { queryKeys } from "@/lib/queryKeys";
import { parseApiResponse, userResponseSchema, paginatedSchema, resourceSchema } from "@/lib/responseSchemas";
import { HttpMethodType } from "@/types/httpMethod";
import { HttpStatusType } from "@/types/httpStatus";
import { HttpError } from "@/utils/httpError";
import { resolveHttpErrorMessage } from "@/utils/resolveHttpErrorMessage";
import { captureError } from "@/lib/error-reporter";
import { handleFormValidationError } from "@/utils/handleFormValidationError";
import { formatDateTime, getInitials } from "@/utils/formatters";
import { useUser } from "@/contexts/user-context";
import { useAuthorization } from "@/hooks/useAuthorization";
import { useListController } from "@/hooks/useListController";
import { useLogout } from "@/hooks/useLogout";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Form } from "@/components/form/form";
import { FormInput, FormTextarea, FormSelect, FormCheckbox, FormSwitch } from "@/components/form/form-fields";
import { FieldGroup } from "@/components/ui/field";
import { DataTable, DataTableColumn, DataTableSort } from "@/components/data-table/data-table";
import { PaginationControls } from "@/components/data-table/pagination-controls";
import { Can } from "@/components/authorization/can";
import { RequirePermission } from "@/components/authorization/require-permission";
import { PageTitle } from "@/components/page-title";
import { loginRoute } from "@/app/config/routes";
import { useTranslations } from "next-intl";
import { keepPreviousData, useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
```

---

## 4. Padrão de Service

Cada service exporta funções `async` tipadas que delegam ao `apiClient`.

```typescript
// src/services/productService.ts (exemplo genérico)
import { apiClient } from "@/lib/api-client";
import { parseApiResponse, paginatedSchema, resourceSchema } from "@/lib/responseSchemas";
import { HttpMethodType } from "@/types/httpMethod";

export async function listProducts(params: ListProductsParams): Promise<ListProductsResponse> {
  const query = buildListQuery(params); // URLSearchParams
  const response = await apiClient<ListProductsResponse>({
    url: `/products${query}`,
    method: HttpMethodType.GET,
    errorMessage: "Erro ao listar produtos.",
  });
  return parseApiResponse(paginatedSchema(productResponseSchema), response);
}

export async function getProduct(id: string): Promise<GetProductResponse> {
  const response = await apiClient<GetProductResponse>({
    url: `/products/${id}`,
    method: HttpMethodType.GET,
    errorMessage: "Erro ao buscar produto.",
  });
  return parseApiResponse(resourceSchema(productResponseSchema), response);
}

export async function createProduct(payload: CreateProductPayload): Promise<GetProductResponse> {
  await requestCsrfCookie(); // só em mutações que precisam de CSRF novo
  return apiClient({ url: "/products", method: HttpMethodType.POST, body: payload, ... });
}
```

Regras:
- `errorMessage` **sempre** em português (fallback)
- Valide resposta com `parseApiResponse(schema, response)`
- Mutações (POST/PUT/PATCH/DELETE) chamam `requestCsrfCookie()` **antes** se o CSRF pode expirar
- Use `HttpMethodType.GET | POST | PUT | PATCH | DELETE`

---

## 5. Padrão de Hook (TanStack Query)

```typescript
"use client";

import { keepPreviousData, useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { queryKeys } from "@/lib/queryKeys";
import { listProducts, createProduct } from "@/services/productService";
import { resolveHttpErrorMessage } from "@/utils/resolveHttpErrorMessage";
import { handleFormValidationError } from "@/utils/handleFormValidationError";

// === Query (leitura) ===
export function useProducts(params: ListProductsParams, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.productsList(params),
    queryFn: () => listProducts(params),
    placeholderData: keepPreviousData,
    enabled: options?.enabled ?? true,
  });
}

// === Mutation (escrita) ===
export function useCreateProduct() {
  const t = useTranslations("toasts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.productsLists });
      toast.success(t("createProductSuccess"));
    },
    onError: (error) => {
      toast.error(resolveHttpErrorMessage(error, t, "createProductError"));
    },
  });
}
```

Regras:
- Leitura: `keepPreviousData`, `enabled` opcional (para gate de permissão)
- Escrita: `invalidateQueries` no `onSuccess`, toast no `onSuccess`/`onError`
- Erro de validação do servidor: use `handleFormValidationError(error, setError, fieldNameMap)`

---

## 6. Padrão de Página (Server Component + Prefetch)

```typescript
// src/app/(dashboard)/products/page.tsx
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { ProductsView } from "@/app/(dashboard)/products/_components/products-view";
import { queryKeys } from "@/lib/queryKeys";
import { fetchProductsOnServer } from "@/lib/server-prefetch"; // apenas se precisar SSR
import { makeServerQueryClient } from "@/lib/server-query";

const INITIAL_PARAMS = { page: 1, perPage: 10, search: "", sort: "created_at", direction: "desc" };

export default async function ProductsPage() {
  const queryClient = makeServerQueryClient();
  await queryClient.prefetchQuery({
    queryKey: queryKeys.productsList(INITIAL_PARAMS),
    queryFn: () => fetchProductsOnServer(INITIAL_PARAMS),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductsView />
    </HydrationBoundary>
  );
}
```

---

## 7. Padrão de Formulário

```typescript
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";

import { Form } from "@/components/form/form";
import { FormInput, FormSelect, FormSwitch } from "@/components/form/form-fields";
import { FieldGroup } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { handleFormValidationError } from "@/utils/handleFormValidationError";

const createProductSchema = (t: ReturnType<typeof useTranslations>) =>
  z.object({
    name: z.string().min(1, t("required")),
    price: z.coerce.number().positive(t("positiveNumber")),
  });

type ProductFormValues = z.infer<ReturnType<typeof createProductSchema>>;

export function ProductForm() {
  const t = useTranslations("products");
  const validation = useTranslations("validation");
  const mutation = useCreateProduct(); // hook de mutation

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(createProductSchema(validation)),
    defaultValues: { name: "", price: 0 },
  });

  const onSubmit = (values: ProductFormValues) => {
    mutation.mutate(values, {
      onError: (error) => handleFormValidationError(error, form.setError, { /* fieldNameMap */ }),
    });
  };

  return (
    <Form form={form} onSubmit={onSubmit}>
      <FieldGroup>
        <FormInput name="name" label={t("name")} disabled={mutation.isPending} />
        <FormInput name="price" label={t("price")} type="number" disabled={mutation.isPending} />
        <Button type="submit" disabled={mutation.isPending}>Salvar</Button>
      </FieldGroup>
    </Form>
  );
}
```

Componentes de campo disponíveis:
| Componente      | Props adicionais                          |
| --------------- | ----------------------------------------- |
| `FormInput`     | `type`, `autoComplete`, `placeholder`     |
| `FormTextarea`  | `rows`                                    |
| `FormSelect`    | `options: { label: string, value: string }[]` |
| `FormCheckbox`  | (nenhuma especial)                        |
| `FormSwitch`    | (nenhuma especial)                        |

---

## 8. Padrão de DataTable + Colunas

```typescript
// _assets/columnDefs.tsx
"use client";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { DataTableColumn } from "@/components/data-table/data-table";

export function useProductColumns(): DataTableColumn<Product>[] {
  const t = useTranslations("products");
  return useMemo(() => [
    {
      id: "name",
      header: t("columnName"),
      cell: (p) => p.name,
      sortable: true,
      sortKey: "name",
    },
    {
      id: "price",
      header: t("columnPrice"),
      cell: (p) => formatCurrency(p.price),
    },
    {
      id: "actions",
      header: <span className="sr-only">{t("columnActions")}</span>,
      headerClassName: "text-right",
      cell: (p) => <RowActions product={p} />,
    },
  ], [t]);
}
```

Uso na view:
```typescript
const { page, perPage, setPage, search, debouncedSearch, onSearchChange, sort, onSortChange } =
  useListController({ perPage: 10, initialSort: { key: "created_at", direction: "desc" } });

<DataTable
  columns={columns}
  data={data?.data ?? []}
  getRowKey={(item) => item.id}
  isLoading={isPending}
  emptyMessage={t("empty")}
  sort={sort}
  onSortChange={onSortChange}
/>
<PaginationControls meta={data?.meta} page={page} isFetching={isFetching} onPageChange={setPage} />
```

---

## 9. Permissões (RBAC)

```typescript
import { Permission } from "@/lib/authorization"; // "users.view" | "users.manage" | "audits.view"
import { useAuthorization } from "@/hooks/useAuthorization";

// Em componente:
const { can, isMaster, user } = useAuthorization();
can("users.view");         // boolean
can("users.manage");       // boolean (só master)

// Gate de UI:
<Can permission="users.manage">...</Can>

// Gate de página:
<RequirePermission permission="users.view" title={t("title")}>...</RequirePermission>

// Gate de query (evita 403):
useUsers(params, { enabled: can("users.view") });
```

| Papel    | Permissões                              |
| -------- | --------------------------------------- |
| `user`   | Nenhuma (só própria conta)              |
| `admin`  | `users.view`, `audits.view`             |
| `master` | `users.view`, `users.manage`, `audits.view` |

---

## 10. i18n

```typescript
// Client component
const t = useTranslations("namespace"); // "users", "account", "toasts", "validation", etc.
t("key");
t("key", { variable: "value" });

// Server component (async)
const t = await getTranslations("namespace");

// Zod schemas como factory
const createXSchema = (t: ReturnType<typeof useTranslations>) => z.object({ ... });
// No componente: resolver: zodResolver(createXSchema(useTranslations("validation")))

// Toasts
const t = useTranslations("toasts");
toast.success(t("successKey"));
toast.error(resolveHttpErrorMessage(error, t, "fallbackKey"));
```

---

## 11. Query Keys

Sempre registre em `src/lib/queryKeys.ts`:
```typescript
export const queryKeys = {
  // lists: ["prefix", "list"] as const,
  // list: (params) => ["prefix", "list", params] as const,
  // detail: (id) => ["prefix", "detail", id] as const,
};
```

Padrão:
- `queryKeys.resourceLists` — prefixo para invalidate de todas as listas
- `queryKeys.resourceList(params)` — lista específica (para cache)
- `queryKeys.resource(id)` — detalhe

---

## 12. Response Schemas (zod)

Sempre em `src/lib/responseSchemas.ts`:
```typescript
export const myResponseSchema = z.object({ id: z.string(), name: z.string(), /* ... */ });

// Uso no service:
return parseApiResponse(paginatedSchema(myResponseSchema), response);
return parseApiResponse(resourceSchema(myResponseSchema), response);
```

Schemas disponíveis:
- `resourceSchema(item)` — `{ data: T, message?: string }`
- `paginatedSchema(item)` — `{ data: T[], links, meta }`
- `userResponseSchema`, `auditResponseSchema`, `loginResponseSchema`

---

## 13. Interfaces

Arquivos em `src/interfaces/` com tipos que NÃO são inferidos de zod:
```typescript
export interface ListProductsParams {
  page?: number;
  perPage?: number;
  search?: string;
  sort?: string;
  direction?: string;
}
```

Tipos inferidos de zod (definidos junto com o schema da entidade ou reexportados):
```typescript
// src/interfaces/product.ts
import { z } from "zod";
import { productResponseSchema } from "@/lib/responseSchemas";
export type Product = z.infer<typeof productResponseSchema>;
```

---

## 14. Server-side Prefetch

Para páginas que precisam de SSR, crie funções em `src/lib/server-prefetch.ts`:
```typescript
export async function fetchProductsOnServer(params: ListProductsParams) {
  const response = await serverApiGet<unknown>(`/products${buildListQuery(params)}`);
  return parseApiResponse(paginatedSchema(productResponseSchema), response);
}
```

Usa `serverApiGet` (faz fetch server-side com cookies) — NÃO o `apiClient` (client-side).

---

## 15. Error Handling

```typescript
import { HttpError } from "@/utils/httpError";
import { captureError } from "@/lib/error-reporter";
import { resolveHttpErrorMessage } from "@/utils/resolveHttpErrorMessage";
import { handleFormValidationError } from "@/utils/handleFormValidationError";
import { isFormValidationHttpError } from "@/utils/formValidationError";

// Em mutations:
onError: (error) => {
  if (!handleFormValidationError(error, setError, fieldNameMap)) {
    toast.error(resolveHttpErrorMessage(error, t, "fallbackKey"));
  }
};

// Em error boundaries / catch:
captureError(error, { source: "products-page" });
```

---

## 16. Organização de código

### Ordem de campos (DB / schemas zod / interfaces)

```
id
ulid
<FKs em ordem alfabética>
<demais campos em ordem alfabética>
created_at
deleted_at
updated_at
```

### Ordem alfabética

- Itens de arrays e objetos literais em ordem alfabética.
- Componentes importados em ordem alfabética.
- Parâmetros de funções em ordem alfabética.

### Organização de funções

1. Funções públicas (exportadas) — em ordem alfabética.
2. Funções privadas (não exportadas) — em ordem alfabética.

---

## 17. Convenções

- **Nunca use `any`** — tipagem estrita sempre
- **Nunca desabilite regras de ESLint** — sem `eslint-disable`
- **Nomes em inglês** (tipos, funções, variáveis, arquivos)
- **Mensagens de erro (fallback) em português**
- **Componentes client:** `"use client"` no topo
- **Componentes server:** sem `"use client"`, async quando necessário
- **Pastas privadas:** prefixo `_` (ex.: `_hooks/`, `_components/`)
- **Testes:** `*.test.ts(x)` ao lado do código testado
- **Commits:** Conventional Commits (`feat:`, `fix:`, `chore:`, etc.)
- **Formatação:** Prettier (tudo padronizado)

# Convenções do boilerplate

Guia para estender esta base de forma consistente. O objetivo é que qualquer
"plataforma com dashboard" parta daqui e adicione features sem reinventar padrões.

## Princípios

- **Camadas desacopladas**: `services` (HTTP) → `interfaces` (contratos) → `hooks`
  (TanStack Query) → `components`/`pages` (UI). Componentes nunca falam com `fetch`
  direto; sempre via service.
- **Tipagem estrita**, sem `any`. Sem comentários inline. Sem desabilitar regras de
  ESLint. Nomes descritivos em inglês.
- **Validação nas duas pontas**: zod nos formulários (entrada) e zod na resposta da
  API (saída), em [`src/lib/responseSchemas.ts`](../src/lib/responseSchemas.ts).
- Tudo formatado com Prettier; `lint`, `test` e `build` devem passar sem erros nem
  warnings.

## Organização de código

### Ordem de campos (banco de dados / schemas zod / interfaces)

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

- Itens de **arrays e objetos** literais em ordem alfabética.
- **Componentes** em ordem alfabética de importação.
- **Parâmetros de funções** em ordem alfabética.

### Organização de funções

Em cada arquivo, agrupe:

1. **Funções públicas** (exportadas) — em ordem alfabética.
2. **Funções privadas** (não exportadas) — em ordem alfabética.

---

## Estrutura por feature

Cada feature vive em `src/app/<feature>/` com subpastas privadas (prefixo `_`):

```
app/(dashboard)/<feature>/
  page.tsx              # composição da tela
  _hooks/               # hooks de dados/forms (TanStack Query)
  _schemas/             # schemas zod do formulário
  _components/          # componentes específicos da feature
  _assets/columnDefs.tsx# colunas de tabela (quando houver listagem)
```

Recursos transversais ficam em `src/services`, `src/interfaces`, `src/hooks`,
`src/lib`, `src/components`.

## Como adicionar um recurso (CRUD)

Exemplo: um recurso `products`.

1. **Interface** — `src/interfaces/product.ts` (entidade) e respostas reusando
   `PaginatedResponse<T>` / `ResourceResponse<T>`.
2. **Schema de resposta** — adicione `productResponseSchema` em
   [`responseSchemas.ts`](../src/lib/responseSchemas.ts) e valide no service com
   `parseApiResponse(...)`.
3. **Service** — `src/services/productService.ts`: funções tipadas (`listProducts`,
   `getProduct`, `createProduct`, ...) delegando ao [`apiClient`](../src/lib/api-client.ts).
4. **Query keys** — registre em [`src/lib/queryKeys.ts`](../src/lib/queryKeys.ts).
5. **Hooks** — `_hooks/useProducts.ts` (lista), `useProductMutation.ts`, etc., usando
   `useQuery`/`useMutation`. Reaproveite [`useListController`](../src/hooks/useListController.ts)
   para o estado de página + busca com debounce.
6. **Colunas** — `_assets/columnDefs.tsx` com `DataTableColumn<Product>[]`. Para colunas
   ordenáveis, marque `sortable: true` e `sortKey` com o nome aceito pela API.
7. **Página** — componha `PageTitle` + `Input` (busca) + [`DataTable`](../src/components/data-table/data-table.tsx)
   - [`PaginationControls`](../src/components/data-table/pagination-controls.tsx).
     Use [`useListController`](../src/hooks/useListController.ts) para página + busca
     (com debounce) + ordenação; passe `sort`/`onSortChange` à `DataTable` e
     `sort?.key`/`sort?.direction` ao hook de dados. Proteja com
     [`RequirePermission`](../src/components/authorization/require-permission.tsx) quando
     for restrito.
8. **Navegação** — adicione o item em [`src/config/navigation.ts`](../src/config/navigation.ts)
   (com `permission` quando aplicável) e um rótulo em `breadcrumbLabels`.
9. **Rota** — registre em [`src/app/config/routes.ts`](../src/app/config/routes.ts) se
   precisar de proteção no proxy.

## Formulários

Use o form kit em vez de fiar `react-hook-form` à mão:

```tsx
const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues });

<Form form={form} onSubmit={(values) => mutation.mutate(values)}>
  <FieldGroup>
    <FormInput name="email" label="E-mail" type="email" />
    <FormSelect name="role" label="Papel" options={roleOptions} />
    <FormSwitch name="active" label="Ativo" />
  </FieldGroup>
  <Button type="submit">Salvar</Button>
</Form>;
```

- Campos: `FormInput`, `FormTextarea`, `FormSelect`, `FormCheckbox`, `FormSwitch`
  ([`form-fields.tsx`](../src/components/form/form-fields.tsx)).
- Erros do servidor: mapeie com
  [`handleFormValidationError`](../src/utils/handleFormValidationError.ts) no `onError`
  da mutation (use o `fieldNameMap` para nomes snake_case da API).

## Autorização

- Permissões em [`src/lib/authorization.ts`](../src/lib/authorization.ts) (`Permission`).
- Em componentes: `useAuthorization().can(permission)` ou `<Can permission>`.
- Em páginas inteiras: `<RequirePermission permission title>`.
- A navegação filtra itens por `permission` automaticamente.
- **Gate de dados**: não basta esconder a UI — passe `enabled: can("...")` à query (ex.:
  `useUsers(params, { enabled: can("users.view") })`) para não disparar requisições que a
  API recusaria (evita 403 desnecessário e ruído no relato de erros).

## Estados de UI

- Listagens vazias: `emptyMessage` do `DataTable`.
- Áreas vazias/erro: [`EmptyState`](../src/components/states/empty-state.tsx) e
  [`ErrorState`](../src/components/states/error-state.tsx).
- Carregamento de rota: `loading.tsx` por segmento.
- Erros de render: `error.tsx` (rota) e `global-error.tsx` (app).

## i18n

- Catálogos em `src/i18n/messages/<locale>.json`; config em
  [`src/i18n/config.ts`](../src/i18n/config.ts).
- Em componentes client: `const t = useTranslations("namespace"); t("chave")`.
- Em componentes server: `const t = await getTranslations("namespace")`.
- **Toasts**: hooks de mutation usam `useTranslations("toasts")`.
- **Validação (zod)**: os schemas são _factories_ `createXSchema(t)` que recebem o
  tradutor de `useTranslations("validation")`; o form hook constrói o resolver com ele.
  Os campos compartilhados (`emailField`, `strongPasswordField`) também recebem `t`.
- **Colunas de tabela**: exporte um hook (`useXColumns`) em vez de uma constante, para
  poder traduzir os cabeçalhos.
- Strings novas devem entrar nos catálogos `pt-BR` e `en`.
- **Troca de idioma em runtime**: o locale é resolvido a partir do cookie `NEXT_LOCALE`
  em [`src/i18n/request.ts`](../src/i18n/request.ts) (sem roteamento por locale na URL).
  O [`LocaleSwitcher`](../src/components/locale-switcher.tsx) grava o cookie via a server
  action [`setLocale`](../src/i18n/setLocale.ts) e chama `router.refresh()`. Para adicionar
  um idioma: inclua-o em `locales`/`localeLabels` ([`config.ts`](../src/i18n/config.ts)) e
  crie o catálogo `messages/<locale>.json`. Ler o cookie torna as páginas renderizadas sob
  demanda (dinâmicas) — esperado para i18n por cookie.

## Segurança e rastreabilidade

- **Cabeçalhos**: os estáticos ficam em `next.config` (`headers()`); a **CSP com nonce**
  é gerada por requisição no [`proxy.ts`](../src/proxy.ts) — estrita em produção
  (`'nonce-…' 'strict-dynamic'`) e relaxada em dev (HMR do Turbopack). Scripts inline de
  terceiros (ex.: `next-themes`) precisam receber o `nonce` (lido em `layout.tsx` via
  `headers()` e repassado pelos `Providers`).
- **Request id**: o [`api-client`](../src/lib/api-client.ts) envia `X-Request-Id` e relê o
  valor ecoado pela API, expondo-o em `HttpError.requestId`.
- **Erros de toast**: use
  [`resolveHttpErrorMessage`](../src/utils/resolveHttpErrorMessage.ts) no `onError` das
  mutations — ele trata `429` (com `Retry-After`) e cai na chave de fallback traduzida.
- **Relato de erros**: [`captureError`](../src/lib/error-reporter.ts) centraliza o envio de
  erros (boundaries + `onError` global do TanStack Query). O padrão só loga em dev; ligue um
  serviço real (Sentry/etc.) com `setErrorReporter` num único ponto.

## Testes

- **Unit/componente** (Vitest): coloque `*.test.ts(x)` ao lado do código. Cubra
  services (com `fetch` mockado), utils, schemas e hooks.
- **E2E** (Playwright): specs em `e2e/`. Fluxos de UI que não dependem da API; e o
  `authenticated.spec.ts`, que roda o fluxo completo contra a API (pula sozinho quando a
  API não responde em `/health`).
- **Integração** (`scripts/*.mjs`): contra a API real.

## Responsividade

- Toda página e componente deve funcionar em **desktop e mobile**.
- Use Tailwind breakpoints (`sm:`, `md:`, `lg:`) para adaptar layout.
- O app shell (sidebar) já colapsa em mobile — respeite esse comportamento.
- Tabelas em mobile: considere cartões ou scroll horizontal quando necessário.

## Design — Ateliê de Cerâmica

A UI deve transmitir a identidade de um **ateliê de cerâmica**:

- **Paleta de cores**: tons terrosos e suaves (terracota, argila, creme, verde sálvia, marrom claro) com um toque minimalista.
- **Bordas**: predominantemente arredondadas (`rounded-lg`, `rounded-md`), lembrando formas orgânicas.
- **Tipografia**: limpa, arejada — uso das fontes Geist (sans) e Geist Mono já configuradas.
- **Sensação**: artesanal, delicada, aconchegante — sem excessos visuais.
- Inputs e cards com sombras suaves e espaçamento generoso.

**Customização**: os componentes shadcn/ui podem ser estilizados via variáveis CSS no `globals.css` e classes Tailwind, respeitando o design system do projeto.

## Campos com texto de ajuda

Para campos ou seções onde a finalidade não é imediatamente óbvia, adicione
`description` ao componente de formulário:

```tsx
<FormInput
  name="slug"
  label="Slug"
  description="Identificador usado na URL. Preenchido automaticamente se deixado em branco."
/>
```

- Descrições devem ser **concisas** — uma ou duas frases.
- Não adicionar descrição em campos autoexplicativos (ex.: nome, e-mail).

## Tabelas (DataTable)

Além do padrão já descrito, observe:

- **Paginação server-side**: os parâmetros `page`, `perPage`, `search`, `sort` e `direction`
  são enviados à API. O `useListController` gerencia o estado local (página, busca com
  debounce, ordenação).
- **Busca textual**: um `<Input type="search">` acima da tabela dispara busca com debounce.
  A API decide em quais campos a busca incide.
- **Ordenação**: colunas com `sortable: true` e `sortKey` definido alternam entre `asc`/`desc`.
  O hook de dados recebe `sort?.key` e `sort?.direction`.
- **Filtros**: quando necessário, adicione controles de filtro entre o título e a tabela.
  Use `<Select>` ou `<Input>` conforme o caso; os valores devem integrar os parâmetros
  da query (ex.: `status`, `category`).
- ⚠️ **Cuidado**: ao mudar filtro, busca ou ordenação, **resete a página para 1**
  (o `useListController` já faz isso em `onSearchChange` e `onSortChange`).

## Qualidade

Antes de concluir qualquer tarefa: `npm run lint`, `npm run typecheck`,
`npm run format:check`, `npm run test` e `npm run build` — todos verdes. O hook de
pre-commit roda `lint-staged` (ESLint + Prettier nos arquivos alterados).

`npm run build` só faz type-check dos arquivos do app (o `tsconfig.json` exclui testes,
e2e e configs para não acoplar o build a tipos de teste). O `npm run typecheck` usa
[`tsconfig.typecheck.json`](../tsconfig.typecheck.json), que cobre **todo** o repositório
(app + testes + e2e + configs) — é o que garante que esses arquivos sejam verificados (e
o que o editor usa para resolver `process`, matchers do jest-dom etc. fora de `src/`).

### Git hooks (pre-commit + commit-msg)

Espelham o captainhook da API. O [`pre-commit`](../.husky/pre-commit) roda o quality gate
na ordem `lint-staged → typecheck → eslint → testes`, parando no primeiro erro (cada
ferramenta imprime o que falhou); o [`pre-push`](../.husky/pre-push) roda o `build` (o
passo mais lento fica fora do commit). O [`commit-msg`](../.husky/commit-msg) valida a
mensagem via [`scripts/verify-commit-msg.mjs`](../scripts/verify-commit-msg.mjs) exigindo
**Conventional Commits** (`<type>[(scope)][!]: <subject>`, subject ≤ 72) com os mesmos
tipos da API: `build, chore, ci, docs, feat, fix, perf, refactor, revert, style, test`.
Os hooks ativam após `git init` + `npm install` (script `prepare`).

# Serv Front

Painel administrativo em Next.js 16 integrado à API [service-fm](https://github.com/hugov-costa/boilerplate)
(Laravel 13 + Sanctum). A organização de código segue o projeto de referência
[sl-front](https://github.com/hugov-costa/sl-front), com camadas desacopladas
(`services`, `interfaces`, `types`, `lib`, `contexts`, `utils`) e hooks, componentes
e schemas colocados por feature.

## Stack

- **Next.js 16** (App Router, Turbopack) e **React 19**
- **TanStack Query** para estado de servidor (cache, revalidação e mutações)
- **react-hook-form + zod** com um _form kit_ próprio (RHF + zod + erros do servidor)
- **shadcn/ui** (Radix + Tailwind CSS v4), com app shell de sidebar + breadcrumbs
- **next-intl** para internacionalização e **next-themes** para tema claro/escuro
- **sonner** para notificações
- **Vitest** (unit/componente) + **Playwright** (e2e) + **ESLint/Prettier** (Prettier
  como regra do ESLint), **husky + lint-staged** e **CI** no GitHub Actions

> Convenções e o passo a passo para adicionar features/recursos estão em
> [`docs/CONVENTIONS.md`](docs/CONVENTIONS.md).

## Pré-requisitos

- Node.js 20 ou superior
- A API service-fm em execução (veja o repositório do boilerplate). Por padrão ela
  responde em `http://localhost:8000` com prefixo `/api/v1` e libera CORS para
  `http://localhost:3000` com suporte a credenciais.

> Para desenvolvimento local, a API foi clonada em `../boilerplate` com um `.env`
> ajustado (`AUTH_COOKIE_SECURE=false` para cookies via HTTP, `MAIL_MAILER=log`) e o
> Postgres/Redis sem portas publicadas no host. Suba apenas o necessário com
> `docker compose up -d app` (traz `app` + `postgres` + `redis`).

## Variáveis de ambiente

Copie `.env.example` para `.env.local` e ajuste se necessário:

| Variável                  | Escopo           | Descrição                                                      |
| ------------------------- | ---------------- | -------------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL`     | Navegador        | URL base da API usada pelo cliente HTTP (ex.: `.../api/v1`).   |
| `API_URL_SERVER`          | Servidor (proxy) | URL base da API usada na guarda de rotas server-side.          |
| `NEXT_PUBLIC_STORAGE_URL` | Navegador        | Origem do storage público (avatares) liberada no `next/image`. |

As variáveis são validadas em tempo de execução em [`src/lib/env.ts`](src/lib/env.ts);
valores ausentes ou inválidos interrompem a aplicação com uma mensagem explícita.

## Como executar

```bash
npm install
cp .env.example .env.local
npm run dev
```

A aplicação fica disponível em `http://localhost:3000`.

## Produção

O guia completo de deploy (front + API + cookies/CORS/CSRF e checklist) está em
[`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md). Use
[`.env.production.example`](.env.production.example) como base (lembre que as
`NEXT_PUBLIC_*` são embutidas no **build** e devem ser passadas como build args).

## Scripts

| Script                     | Descrição                                           |
| -------------------------- | --------------------------------------------------- |
| `npm run dev`              | Ambiente de desenvolvimento                         |
| `npm run build`            | Build de produção                                   |
| `npm run start`            | Sobe o build de produção                            |
| `npm run lint`             | ESLint (deve passar sem erros nem warnings)         |
| `npm run typecheck`        | TypeScript no repositório completo (app/testes/e2e) |
| `npm run format`           | Formata o projeto com Prettier                      |
| `npm run format:check`     | Verifica a formatação sem alterar arquivos          |
| `npm run test`             | Testes unitários/componente (Vitest)                |
| `npm run test:e2e`         | Testes de ponta a ponta no navegador (Playwright)   |
| `npm run test:integration` | Teste de integração contra a API real               |

## Funcionalidades

- **Autenticação**: registro, login (com etapa de código quando o 2FA está ativo),
  logout e proteção de rotas via `proxy.ts`.
- **Recuperação de senha**: solicitação (`/forgot-password`) e redefinição via token
  do e-mail (`/reset-password`).
- **Verificação de e-mail**: página `/verify-email` que consome o link assinado,
  reenvio do e-mail e banner de aviso enquanto a conta não está verificada.
- **Conta** (`/account`): edição de perfil (com senha atual ao trocar o e-mail),
  troca de senha, imagem de perfil (upload/remoção) e autenticação em dois fatores
  (provisionamento com chave/QR/códigos de recuperação, confirmação e desativação).
- **Usuários**: listagem paginada e auditoria por usuário (papéis `admin` e `master`);
  edição, exclusão (lógica), atribuição de papéis e **eliminação de dados (LGPD)**
  restritas ao `master`.
- **Auditoria**: trilha geral filtrável por evento, com paginação (papéis `admin`/`master`).
- **Papéis (RBAC)**: três papéis — `user` (apenas a própria conta), `admin` (lê os demais)
  e `master` (gerencia os demais e atribui papéis). O `can()`/`useAuthorization`
  derivam as permissões do `role` retornado pela API.
- **Personificação (impersonation)**: um `master` pode atuar temporariamente como outro
  usuário (não-master) para suporte. Inicia-se na lista de usuários informando um motivo;
  um banner persistente indica a sessão ativa e permite encerrá-la. A sessão é
  time-boxed, registrada em auditoria na API e bloqueia ações de identidade/credenciais.

## Arquitetura

```
src/
  proxy.ts                # Guarda de rotas server-side (Next 16: ex-"middleware")
  app/
    config/routes.ts      # Rotas públicas, de autenticação e protegidas
    layout.tsx            # Layout raiz + Providers globais
    login/                # Login (com etapa de código 2FA)
    register/             # Registro
    forgot-password/      # Solicitação de redefinição de senha
    reset-password/       # Redefinição via token do e-mail
    verify-email/         # Confirmação do e-mail (link assinado)
    (dashboard)/          # Grupo de rotas autenticadas
      layout.tsx          # Shell autenticado (navegação + banner de verificação)
      page.tsx            # Página inicial do painel
      account/            # Conta: perfil, senha, 2FA e avatar
      users/              # Usuários (lista, edição, exclusão, auditoria por usuário)
      audits/             # Auditoria geral (admin)
  components/
    ui/                   # Componentes shadcn/ui (sidebar, dialog, select, ...)
    form/                 # Form kit (Form + FormInput/Select/Checkbox/Switch) + TextField
    data-table/           # Tabela genérica tipada + controles de paginação
    dashboard/            # App shell (sidebar, breadcrumbs, header)
    authorization/        # <Can> e <RequirePermission>
    states/               # EmptyState / ErrorState
    providers.tsx         # Composição de Intl, Theme, Query, User e Toaster
    theme-toggle.tsx      # Alternância de tema claro/escuro
  config/navigation.ts    # Navegação dirigida por configuração (role-aware)
  contexts/               # Contexto do usuário autenticado
  hooks/                  # Hooks transversais (useCurrentUser, useAuthorization, ...)
  i18n/                   # next-intl: config, request e catálogos de mensagens
  interfaces/             # Tipos de domínio e contratos de resposta da API
  lib/                    # Cliente HTTP, env, authorization, response schemas, utils
  services/               # Camada de comunicação com a API
  types/                  # Enums HTTP (método e status)
  utils/                  # Erros HTTP, formatação e validação de formulários
```

### Camada de integração

- [`src/lib/api-client.ts`](src/lib/api-client.ts): cliente `fetch` tipado, com
  `credentials: "include"`, tratamento de respostas Problem JSON (RFC 7807) e
  proteção CSRF (veja abaixo).
- [`src/services`](src/services): cada recurso expõe funções tipadas que delegam ao
  cliente HTTP, sem acoplar componentes à URL ou ao formato das requisições.
- [`src/interfaces`](src/interfaces): contratos das entidades e respostas (incluindo
  o tipo genérico de paginação do Laravel em
  [`paginatedResponse.ts`](src/interfaces/paginatedResponse.ts)).

### Autenticação e CSRF

A API autentica clientes de navegador via cookie httpOnly `access_token`
(Sanctum) e protege requisições mutantes com CSRF de duplo envio:

- O login e o registro chamam `requestCsrfCookie()` antes de enviar dados, obtendo o
  cookie `XSRF-TOKEN`.
- Em requisições `POST`, `PUT`, `PATCH` e `DELETE`, o cliente HTTP lê o cookie CSRF e o
  reenvia no cabeçalho `X-XSRF-TOKEN`. Em produção a API emite o cookie com o prefixo
  `__Host-` (`__Host-XSRF-TOKEN`); o cliente procura esse nome primeiro e cai para
  `XSRF-TOKEN` em dev sobre HTTP puro (onde o prefixo, que exige `Secure`, não se aplica).
- A sessão é checada no servidor por [`src/proxy.ts`](src/proxy.ts), que valida o
  cookie `access_token` contra `GET /user` e usa um cache de curta duração
  ([`src/lib/auth-cache.ts`](src/lib/auth-cache.ts)) para evitar chamadas repetidas.
- Rotas de autenticação redirecionam usuários logados para o painel; rotas
  protegidas redirecionam visitantes não autenticados para `/login`.

### Endpoints consumidos

Todos sob o prefixo `/api/v1`:

- Autenticação: `POST /register`, `POST /login`, `POST /logout`, `GET /user`
- Senha: `PUT /user/password`, `POST /forgot-password`, `POST /reset-password`
- Verificação de e-mail: `GET /email/verify/{id}/{hash}` (link assinado),
  `POST /email/verification-notification`
- Dois fatores: `POST /two-factor/enable`, `POST /two-factor/confirm`,
  `DELETE /two-factor`
- Usuários: `GET /users`, `GET /users/{user}`, `PATCH /users/{user}`,
  `DELETE /users/{user}`
- Avatar: `POST /users/{user}/avatar`, `DELETE /users/{user}/avatar`
- Auditoria (admin): `GET /users/audits`, `GET /users/{user}/audits`

### Contrato da API (validado contra a API real)

- Todas as respostas são envelopadas em `{ data, message }`.
- `POST /login` e `POST /register` retornam o usuário em **`data.user`** (junto de
  `token` e `token_type`); `GET /user`, `GET /users/{id}` e `PATCH /users/{id}`
  retornam o usuário diretamente em **`data`**.
- O **`id` do usuário é uma string ULID** (não numérico). Campos do usuário:
  `id`, `name`, `email`, `admin`, `avatar_url`, `email_verified_at`,
  `created_at`, `updated_at`.
- `GET /users` (listagem paginada com `data`/`meta`/`links`) é **restrito a
  administradores** — usuários comuns recebem `403`, tratado na tela de usuários.
- Requisições mutantes sem o cabeçalho `X-XSRF-TOKEN` recebem `419`.

## Convenções e qualidade

- Tipagem estrita, sem uso de `any`.
- Sem comentários inline e sem desativar regras do ESLint.
- Nomes descritivos em inglês para funções, variáveis e componentes.
- Código formatado com Prettier e validado por `npm run lint` e `npm run build`.

## Testes

### Unitários e de componente (Vitest)

`npm run test` roda a suíte Vitest (jsdom) sobre a lógica pura e a camada de
integração — sem depender da API: validação de formulários, cliente HTTP (CSRF,
mapeamento de erros, FormData, URL assinada), validação de respostas com zod, services
(com `fetch` mockado), tratamento de erros e o componente de campo de formulário.

### Ponta a ponta no navegador (Playwright)

`npm run test:e2e` sobe o app (`next dev`) e roda os fluxos de UI no Chromium: validação
de login, confirmação de senha no registro, navegação entre as telas de auth e o
redirecionamento de rota protegida. Não requer a API em execução (o `proxy` trata a API
indisponível como sessão ausente). Na primeira vez, instale o navegador com
`npx playwright install chromium`.

### Integração contra a API real

O script [`scripts/integration-test.mjs`](scripts/integration-test.mjs) exercita, contra
a API real, o mesmo fluxo HTTP que o frontend usa: obtenção do cookie CSRF, registro,
login (com verificação do envelope `data.user` e do cookie `access_token`), `GET /user`,
`GET /users/{id}`, `PATCH`, rejeição de mutação sem CSRF (`419`) e logout (`GET /user`
retorna `401`). A listagem `GET /users` é aceita como `200` (admin) ou `403` (usuário
comum).

Com a API em execução:

```bash
npm run test:integration
# ou apontando para outra URL:
API_BASE_URL=http://localhost:8000 npm run test:integration
```

Para validar os fluxos restritos a administradores (listar e excluir usuários), promova
um usuário no banco da API:

```bash
docker compose exec -T postgres \
  psql -U service_fm -d service_fm \
  -c "UPDATE users SET admin = true WHERE email = 'seu@email.com';"
```

O script [`scripts/features-test.mjs`](scripts/features-test.mjs) cobre as demais
funcionalidades contra a API real: auditoria, upload/remoção de avatar (MinIO),
reenvio de verificação, recuperação de senha, troca de senha e o ciclo completo de
2FA (incluindo geração de um código TOTP). Ele roda em fases para contornar o limite
de tentativas (`throttle:auth`, 5/min por e-mail) da API:

```bash
node scripts/features-test.mjs register
docker compose exec -T postgres psql -U service_fm -d service_fm \
  -c "UPDATE users SET admin = true WHERE email = '<email gerado>';"
docker compose exec -T redis redis-cli FLUSHALL
node scripts/features-test.mjs verify
docker compose exec -T redis redis-cli FLUSHALL
node scripts/features-test.mjs twofa
```

> Requer os serviços `app`, `postgres`, `redis` e `minio` em execução
> (`docker compose up -d app minio createbuckets`).

## Diretrizes para mudanças futuras

Ao concluir qualquer tarefa: rode `npm run lint`, `npm run format:check` e
`npm run build` (todos devem passar sem erros nem warnings) e documente as
alterações relevantes neste README.

## Histórico de alterações

### Endurecimento pós-auditoria (segurança, performance e qualidade)

- **CSRF `__Host-`**: o cliente HTTP passou a procurar o cookie `__Host-XSRF-TOKEN`
  (emitido em produção) antes do `XSRF-TOKEN`, acompanhando o prefixo de cookie adotado
  pela API ([`src/lib/api-client.ts`](src/lib/api-client.ts)).
- **Open redirect**: `resolveSafeRedirectPath` passou a rejeitar caminhos com barra
  invertida (`/\evil.com`), que o navegador normaliza para `//` e transformaria em URL
  protocol-relative ([`src/lib/session-redirect.ts`](src/lib/session-redirect.ts)).
- **Tratamento de erro centralizado**: os _hooks_ de mutação migraram o padrão duplicado
  `error instanceof HttpError ? … : t(…)` para `resolveHttpErrorMessage`, que também
  trata `429` (Too Many Requests) de forma consistente.
- **Testes**: cobertura para `resolveHttpErrorMessage`, para a preferência do cookie
  `__Host-` e para os novos casos de open redirect.

### Server Components (prefetch + hidratação)

- Adicionada a camada de leitura no servidor: `lib/server-api.ts` (GET autenticado que
  encaminha os cookies da requisição — `access_token` e `impersonate_token`), com
  `lib/server-query.ts` e `lib/server-prefetch.ts`.
- As páginas de dados (`/users`, `/users/[id]`, `/audits`) passaram a ser Server
  Components que pré-buscam a primeira carga no servidor e entregam via
  `HydrationBoundary`; a interatividade (busca, ordenação, paginação, mutações) ficou em
  _client views_ (`*-view.tsx`). O layout autenticado pré-busca o usuário atual.
- As tabelas chegam já renderizadas (sem spinner inicial) quando a permissão resolve, e
  o cliente reidrata o cache sem refazer a requisição (dentro do `staleTime`).

### Papéis (RBAC), personificação e endurecimento

- Substituído o sinalizador booleano `admin` por papéis `user`/`admin`/`master`. O tipo
  `User` passou a ser derivado do schema zod (`z.infer`), e os serviços retornam o payload
  já validado por `parseApiResponse` (fim do valida-e-descarta).
- `authorization`/`useAuthorization` agora derivam permissões do `role`: `admin` lê os
  demais; `master` gerencia e atribui papéis.
- Adicionada a personificação para o `master`: serviço, `useImpersonation`, banner
  persistente e diálogo de início (com motivo) na lista de usuários.
- i18n resolvido no servidor (as mensagens do locale ativo são passadas via `Providers`,
  evitando o envio dos dois bundles ao cliente).
- Polimentos: `useMemo` nas colunas da tabela, invalidação de cache por namespace
  (lista vs. detalhe), `optimizePackageImports`, `target` ES2022 e remoção de strings
  fixas em PT na tabela/paginação.

### Integração inicial com a API service-fm

- Adicionada a stack de integração: TanStack Query, react-hook-form, zod,
  shadcn/ui, sonner e next-themes.
- Criada a camada desacoplada de comunicação (`lib/api-client`, `services`,
  `interfaces`, `types`, `utils`).
- Implementados o fluxo de autenticação (login, registro, logout, sessão) e a
  guarda de rotas via `proxy.ts`.
- Implementada a tela de usuários (listagem paginada, edição e exclusão).
- Configurados Prettier e a integração Prettier ↔ ESLint, além das variáveis de
  ambiente tipadas e validadas.

### Validação contra a API real

- Adicionado o script de teste de integração (`scripts/integration-test.mjs`) e o
  comando `npm run test:integration`.
- Ajustado o modelo `User` e o fluxo de autenticação ao contrato real: `id` como ULID
  (string), usuário em `data.user` no login/registro, campos `admin`/`avatar_url`.
- Tratado o `403` da listagem de usuários (restrita a administradores) na tela de
  usuários.

### Cobertura completa das funcionalidades da API

- Implementadas recuperação e troca de senha, verificação de e-mail (página de
  confirmação, reenvio e banner), conta com perfil/avatar/2FA, etapa de código 2FA no
  login e auditoria (geral e por usuário).
- `api-client` estendido para upload `multipart/form-data` (avatar) e para chamadas a
  URLs assinadas (verificação de e-mail), com validação de origem.
- Adicionado o script `scripts/features-test.mjs`, que validou todas as
  funcionalidades contra a API real (incluindo 2FA com TOTP e avatar no MinIO).

### Resiliência, testes e ajustes de qualidade

- **Testes automatizados**: Vitest (unit/componente) com 36 testes e Playwright
  (e2e de navegador) para os fluxos de autenticação.
- **Tratamento global de 401**: respostas não autorizadas limpam a sessão e
  redirecionam para o login; janela do cache de sessão do proxy reduzida para 30s.
- **Redirect pós-login**: o `proxy` preserva a rota pretendida (`?redirect=`) e o login
  retorna a ela (com proteção contra open redirect).
- **Validação de respostas com zod** na fronteira dos services, falhando de forma clara
  quando o contrato da API diverge.
- **UX/infra**: debounce na busca de usuários, `next/image` com `remotePatterns`
  derivado das variáveis de ambiente, e _error boundaries_ (rota autenticada e global).

### Boilerplate: app shell, kits e DX

- **App shell** de dashboard: sidebar colapsável + breadcrumbs + header, com
  **navegação dirigida por configuração** ([`config/navigation.ts`](src/config/navigation.ts))
  e sensível a permissão.
- **Form kit**: `<Form>` + `FormInput/FormTextarea/FormSelect/FormCheckbox/FormSwitch`
  (RHF + zod + erros do servidor). **Todos os formulários** usam o kit; o `TextField`
  legado foi removido.
- **Autorização** centralizada: `Permission`, `useAuthorization`, `<Can>` e
  `<RequirePermission>`, substituindo verificações `user.admin` espalhadas.
- **2FA reflete o estado real**: com o `UserResource` da API expondo
  `two_factor_enabled`, o card de 2FA deriva o estágio do flag do usuário (em vez de
  começar sempre "idle"), só oferece "desativar" quando ativo e permite **regenerar os
  códigos de recuperação**.
- **Relato de erros plugável**: [`captureError`](src/lib/error-reporter.ts) é um sink
  único (no-op em produção por padrão) ligado aos error boundaries e ao `onError` do
  TanStack Query; troque por Sentry/etc. via `setErrorReporter` num único ponto.
- **i18n** completo com next-intl (catálogos `pt-BR`/`en`): **toda a superfície
  traduzível** — telas, navegação, toasts e mensagens de validação (via schemas
  zod como _factories_ que recebem o tradutor). **Troca de idioma em runtime** via
  `LocaleSwitcher` (header do dashboard e telas de auth), com persistência em cookie
  (`NEXT_LOCALE`) por uma server action.
- **Estados e a11y**: `EmptyState`/`ErrorState`, `loading.tsx`, toggle de tema e
  skip-to-content.
- **Padrão de recurso**: `useListController` + `DataTable`/`PaginationControls`
  reutilizáveis, agora com **ordenação server-side** (colunas `sortable`, indicador e
  `aria-sort`); guia em [`docs/CONVENTIONS.md`](docs/CONVENTIONS.md).
- **Cabeçalhos de segurança**: estáticos via `next.config` (`X-Frame-Options`,
  `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, HSTS) e **CSP com
  nonce** gerada no [`proxy.ts`](src/proxy.ts) (estrita em produção via `strict-dynamic`,
  relaxada em dev para o HMR; o nonce é propagado ao `next-themes`).
- **Rastreabilidade**: o `api-client` envia e relê `X-Request-Id`, anexando-o ao
  `HttpError` para correlacionar erros do front com os logs da API.
- **UX de limite de taxa**: respostas `429` viram um aviso amigável com o tempo de
  espera (`Retry-After`), via [`resolveHttpErrorMessage`](src/utils/resolveHttpErrorMessage.ts).
- **DX & entrega**: CI no GitHub Actions (lint, typecheck, format, testes, build, e2e, SAST) e
  **Dockerfile de produção** multi-stage (`output: "standalone"`). Cobertura de testes
  ampliada para as camadas reutilizáveis (autorização, `useListController`, form kit,
  `DataTable`, sink de erros).
- **Git hooks (husky)** espelhando o captainhook da API: `pre-commit` roda o quality gate
  (lint-staged → typecheck → eslint → testes, parando no primeiro erro), `pre-push` roda o
  `build` e `commit-msg` exige **Conventional Commits** (mesmos tipos da API). Ativam com
  `git init` e `npm install`.
- **E2E autenticado contra a API**: `e2e/authenticated.spec.ts` exercita
  registro→sessão→conta→logout de ponta a ponta (cookie + proxy). Pula automaticamente
  quando a API não está acessível; o CI o roda num job dedicado que sobe a API via Docker.

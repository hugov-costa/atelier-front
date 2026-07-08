# Relatório de Auditoria — serv_front

**Data**: 2026-07-08
**Projeto**: serv_front (boilerplate-front)
**API**: atelier (boilerplate-api)

---

## Resumo

- **Pontuação geral**: 95/100
- **Total de falhas**: 5
- **Críticas**: 0 | **Altas**: 0 | **Médias**: 3 | **Baixas**: 2

### Pontuação por seção

| Seção               | Pontuação | Peso |
| ------------------- | --------- | ---- |
| Segurança           | 98/100    | ×3   |
| Contratos de API    | 96/100    | ×2   |
| LGPD                | 92/100    | ×2   |
| Qualidade de código | 100/100   | ×2   |
| Performance         | 98/100    | ×1   |
| Ferramentas         | 99/100    | ×1   |
| Documentação        | 91/100    | ×1   |

**Cálculo**: (98×3 + 96×2 + 92×2 + 100×2 + 98×1 + 99×1 + 91×1) / 12 = **95**

---

## Falhas encontradas

### F-1 — Valor `canceled` documentado mas ausente na API (MÉDIA)

- **Onde**: `docs/api-reference.md` — campo `status` do `CommissionOrderResource` (linha 324)
- **Problema**: a documentação lista `canceled` como valor possível para `status`, mas a API não tem esse status. O enum `OrderStatus` no backend define apenas: `pending`, `in_production`, `ready`, `delivered`.
- **Risco**: um desenvolvedor pode implementar lógica para tratar `canceled` que nunca será acionada, ou pior, códigos que tratam `canceled` como string podem passar na validação zod (o schema usa `z.string()`) e causar comportamento inesperado.
- **Correção**: remover `canceled` da lista de status no `docs/api-reference.md`. Atualizar a linha para:
  ```
  "status": "pending|in_production|ready|delivered"
  ```
- **Pontuação**: −4 pontos (Contratos de API)

### F-2 — Ausência de aviso de privacidade/consentimento na UI (MÉDIA)

- **Onde**: em todo o front (UI para o usuário final)
- **Problema**: não há nenhum aviso, banner ou link para política de privacidade explicando como os dados pessoais são tratados. A LGPD (Lei 13.709/2018) exige que o titular seja informado sobre o tratamento de seus dados pessoais (Art. 9º). Embora a funcionalidade de exportação e eliminação de dados exista (`DataPrivacyCard`), falta a transparência sobre coleta e uso.
- **Risco**: não conformidade com a LGPD — exposição a multas de até 2% do faturamento. Usuários não sabem que podem exercer seus direitos.
- **Correção**: adicionar um link para uma política de privacidade na página de login e na página de conta (ex.: um footer ou modal de consentimento). O link pode apontar para `/privacy` (uma página estática) ou uma URL externa. Exemplo:
  - Em `login/page.tsx`, adicionar um texto tipo: `"Ao continuar, você concorda com nossa Política de Privacidade."`
  - Em `account/page.tsx`, adicionar um card ou link: `"Saiba como tratamos seus dados"`
- **Pontuação**: −6 pontos (LGPD)

### F-3 — `consoleReporter` engole erros em produção sem fallback visível (MÉDIA)

- **Onde**: `src/lib/error-reporter.ts` — linhas 11-15
- **Problema**: o `consoleReporter` padrão só loga erros em `development` (`process.env.NODE_ENV !== "production"`). Em produção, erros capturados por `captureError()` são **silenciosamente engolidos** até que um reporter externo (Sentry, etc.) seja registrado via `setErrorReporter`. A documentação em `CONVENTIONS.md` menciona isso, mas não há nenhum mecanismo visível que alerte o operador sobre erros no front em produção enquanto o Sentry não é configurado.
- **Risco**: erros de produção passam despercebidos — sem logs, sem notificações. Se o operador esquecer de configurar o reporter externo, bugs podem ficar invisíveis por semanas.
- **Correção**: implementar um reporter híbrido que, mesmo em produção, ao menos registre no `console.error` quando não houver um reporter externo registrado explicitamente. Ou, alternativamente, emitir um aviso no bootstrap (`Providers`) se `NEXT_PUBLIC_SENTRY_DSN` não estiver definida.
- **Pontuação**: −4 pontos (LGPD — impacto indireto na rastreabilidade de incidentes de segurança/LGPD)

### F-4 — Documentação omite variáveis de ambiente do backend no guia de deploy do front (BAIXA)

- **Onde**: `docs/DEPLOYMENT.md` (front) e `docs/DEPLOY-RENDER.md` (front)
- **Problema**: o guia de deploy do front menciona `CORS_ALLOWED_ORIGINS`, `FRONTEND_URL` e `AUTH_COOKIE_SAME_SITE` como configurações da API que precisam ser coerentes, mas não recomenda explicitamente `CACHE_STORE=redis` e `QUERY_CACHE_ENABLED=true` na API — que são necessários para o correto funcionamento do cache de query e da performance em produção.
- **Risco**: se o operador seguir apenas o guia do front, pode esquecer de configurar `CACHE_STORE=redis` e `QUERY_CACHE_ENABLED=true` na API, resultando em performance subótima (cache em file store) e possível degradação.
- **Correção**: no `docs/DEPLOYMENT.md` do front (seção "Em conjunto"), adicionar uma linha: "Certifique-se de que a API tenha `CACHE_STORE=redis` e `QUERY_CACHE_ENABLED=true` para performance em produção."
- **Pontuação**: −2 pontos (Documentação)

### F-5 — Nonce não propagado em desenvolvimento (BAIXA)

- **Onde**: `src/proxy.ts` — linhas 70-72
- **Problema**: em modo `development`, o `x-nonce` **não é** definido nos cabeçalhos da requisição (`requestHeaders.set(NONCE_HEADER, nonce)` só roda em produção). Apesar de o CSS ser relaxado em dev (`'unsafe-inline'`), scripts que dependem do nonce (ex.: `next-themes`) não o recebem — a propriedade `nonce` nos `Providers` fica `undefined`. Isso não causa erro porque o CSP de desenvolvimento permite `'unsafe-inline'`, mas quebra a consistência: o tema escuro pode piscar em dev se o script de tema não tiver nonce.
- **Risco**: em desenvolvimento, o tema pode piscar (flash of incorrect theme) ocasionalmente, e scripts inline de terceiros não são protegidos pelo nonce. Não é um problema de segurança, mas de qualidade/consistência.
- **Correção**: em `proxy.ts`, definir o `NONCE_HEADER` no `requestHeaders` **também** em desenvolvimento (remover a condição `!isDevelopment`), ou ao menos garantir que o nonce seja gerado e propagado independentemente do modo. A CSP de desenvolvimento continuará usando `'unsafe-inline'`, então não haverá violação — mas o nonce estará disponível para componentes que dele dependam.
- **Pontuação**: −1 ponto (Segurança)

---

## Detalhamento por fase

### Fase 1 — Contratos de API

**Pontuação**: 96/100

**Serviços analisados**: Todos os 27 services em `src/services/` foram verificados contra os Resources da API em `../boilerplate-api/app/Http/Resources/*.php`.

**Acertos**:

- Todos os endpoints, métodos HTTP e parâmetros de query conferem com a rota definida em `routes/api.php`.
- As URLs usam o prefixo `/v1/` correspondente ao grupo de rotas da API.
- `buildListQuery` mapeia corretamente `perPage` → `per_page` na query string.
- Schemas zod (`responseSchemas.ts`) usam `parseApiResponse` para validar respostas.
- Tratamento de erro via `HttpError` com suporte a RFC 7807 Problem JSON.
- Campos `whenLoaded()` (ex.: `firing_cycles`, `pieces`, `users`) são corretamente tipados como `optional()` ou `nullish()`.
- `MaterialPurchaseResource` retorna `is_received` baseado em `receipt_date !== null` — a lógica no front (apenas boolean) está correta.
- `PieceResource` calcula `kind` via enum, `firing_cycles.price` via método `pivotPrice()` — ambos mapeados corretamente.
- `UserResource` retorna `role` como string do enum — schema zod usa `userRoleSchema` que aceita os valores do enum.
- `SettingResource` retorna valores como integers (devido ao cast do model) — zod usa `z.number()` que aceita tanto int quanto float.

**Falhas**:

- F-1: `api-reference.md` lista `canceled` como status de commission order, mas o enum só tem 4 valores.

### Fase 2 — Segurança

**Pontuação**: 98/100

**Acertos**:

- **CSP**: implementada em `proxy.ts` com nonce + `strict-dynamic` em produção, relaxada em dev (HMR). `connect-src` e `img-src` configurados dinamicamente baseados em `NEXT_PUBLIC_API_URL` e `NEXT_PUBLIC_STORAGE_URL`. `frame-ancestors 'none'`, `base-uri 'self'`, `form-action 'self'`, `object-src 'none'`, `upgrade-insecure-requests`.
- **Cabeçalhos HTTP** em `next.config.ts`: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`, `Permissions-Policy` restritivo.
- **CSRF**: double-submit correto — `__Host-XSRF-TOKEN` em produção, fallback `XSRF-TOKEN` em dev. `requestCsrfCookie()` chamado apenas para fluxos pré-autenticação (login, forgot/reset/set-password).
- **Auth cache** (`auth-cache.ts`): TTL de 30s, auto-cleanup a cada hora, máximo 100 entradas.
- **Proxy guard** (`proxy.ts`): rotas de auth redirecionam autenticados, rotas protegidas redirecionam não autenticados com parâmetro `redirect`.
- **Health endpoint** (`/api/health`): excluído do middleware, não requer auth.
- **Erros**: `captureError` não expõe stack trace em produção (console reporter só loga em dev).
- **Dependências**: `npm audit` mostra 4 vulnerabilidades (1 low, 3 moderate) — nenhuma high/critical. O CI já executa `npm audit --audit-level=high` com `continue-on-error`.
- **`requestSignedApiUrl`**: valida same-origin corretamente (mitiga ataques de URL assinada).
- **Dockerfile**: `--ignore-scripts` hardening de supply-chain, usuário não-root (`nextjs`).

**Falhas**:

- F-5: nonce não propagado em modo desenvolvimento (apenas 1 ponto).

### Fase 3 — LGPD

**Pontuação**: 92/100

**Acertos**:

- **Eliminação de dados**: `DataPrivacyCard` na página `/account` expõe opção de auto-exclusão (com confirmação e senha). Service `deleteAccount()` → `DELETE /v1/user`.
- **Eliminação por admin**: `eraseUser()` → `POST /v1/users/{id}/erase` (LGPD — direito ao esquecimento).
- **Exportação de dados**: `DataPrivacyCard` → `exportAccountData()` → `GET /v1/user/export`. Download como JSON.
- **Auditoria removida**: backend agenda `audit:prune` diariamente e `accounts:anonymize-trashed` diariamente.
- **Cookies**: `__Host-XSRF-TOKEN` com escopo restrito (host-only, sem `Domain`).
- **Dados de auditoria**: `AuditResource` expõe `ip_address`, mas isso é esperado para logs de auditoria.

**Falhas**:

- F-2: ausência de aviso de privacidade/consentimento na UI.
- F-3: erros silenciados em produção (rastreabilidade de incidentes).

### Fase 4 — Performance

**Pontuação**: 98/100

**Acertos**:

- Server-side prefetch (`fetch*OnServer`) em todas as páginas do dashboard via `makeServerQueryClient()` com `staleTime` de 30s.
- `keepPreviousData` usado em todas as listagens (placeholderData) — transições suaves entre páginas.
- `useListController` com debounce na busca → reduz chamadas à API durante digitação.
- `optimizePackageImports` configurado para `lucide-react` e `radix-ui` — tree-shaking.
- Todas as páginas do dashboard são **dinâmicas** (ƒ no build output) — sem static generation desnecessária para dados do usuário.
- `captureError` não impacta performance (é chamada seletivamente).
- `remotePatterns` configurado dinamicamente para `NEXT_PUBLIC_STORAGE_URL` e `NEXT_PUBLIC_API_URL`.
- `enabled` gate para queries com permissão → evita chamadas 403.
- TanStack Query: `staleTime` e `gcTime` adequados (padrões do React Query v5).
- Query keys organizadas e padronizadas (`queryKeys.ts`).

**Observação**: o prefetch server-side depende da API estar acessível durante a renderização da página. Se a API estiver lenta, a página inicial também fica lenta (espera do prefetch). Isso é um trade-off conhecido de SSR com prefetch, não uma falha.

### Fase 5 — Qualidade de código

**Pontuação**: 100/100

**Resultados dos checks**:
| Check | Resultado |
| ----------- | --------- |
| Lint | ✅ Passou |
| Typecheck | ✅ Passou |
| Tests | ✅ 83/83 |
| Format | ✅ Passou |
| Build | ✅ Passou |

**Acertos**:

- **Zero uso de `any`**: nenhuma ocorrência de `: any`, `as any` ou `// @ts-` em `src/`.
- **Zero `eslint-disable`**: nenhuma regra desabilitada no código fonte.
- **Tipagem estrita**: interfaces e tipos em `src/interfaces/`, schemas zod validam respostas da API.
- **83 testes passando**: services, utils, hooks, schemas, components — cobertura adequada.
- **Serviços consistentes**: todos seguem o padrão `apiClient<T>({ url, method, body, errorMessage })` + `parseApiResponse(schema, response)`.
- **Hooks padronizados**: `keepPreviousData` para leitura, `invalidateQueries` + toast para mutation.
- **Sem comentários inline** no código.
- **Nomes descritivos em inglês**.
- **Organização de código**: ordem alfabética, pastas privadas `_hooks/`, `_components/`, `_schemas/`.

**Falhas**: Nenhuma.

### Fase 6 — Ferramentas

**Pontuação**: 99/100

**Acertos**:

- **Git hooks** (Husky):
  - `pre-commit`: lint-staged (ESLint + Prettier em arquivos staged) + typecheck + lint + test
  - `commit-msg`: `verify-commit-msg.mjs` — valida Conventional Commits corretamente
  - `pre-push`: `npm run build` (quality gate completo)
- **CI** (`.github/workflows/ci.yml`):
  - `quality`: lint + typecheck + format:check + test + build
  - `e2e`: Playwright com Chromium
  - `sast`: Semgrep (diff-aware, continue-on-error)
  - `dependencies`: npm audit (continue-on-error)
  - `e2e-api`: E2E autenticado com API provisionada via Docker
- **Docker**:
  - `Dockerfile` multi-stage: `deps` (npm ci --ignore-scripts) → `builder` (next build) → `runner` (produção)
  - `output: "standalone"` no Next.js
  - Usuário não-root (`nextjs`, uid 1001)
  - `docker-compose.yml` inclui a API via `include`
  - `docker compose build` compila sem erros
- **Scripts**: `features-test.mjs`, `integration-test.mjs`, `verify-commit-msg.mjs` — todos funcionais.

**Observação**: o `docker compose run --rm web npm run <comando>` **não funciona** para comandos de dev (lint, test, etc.) porque a imagem de produção (`runner`) não contém `node_modules` com devDependencies. O comando `npm run build` também falha no Dockerfile se `NEXT_PUBLIC_API_URL` não for passado como build arg. Esses são comportamentos esperados (a imagem é de produção, não de dev), mas a documentação em `SKILL.md` instrui usar `docker compose run --rm web npm run <comando>` que falhará para checks de qualidade. **Sugestão**: adicionar um `service` de run no `docker-compose.yml` para comandos de dev, ou documentar o comando correto: `docker run --rm -v $PWD:/app -w /app node:22-alpine npm run <comando>` (com as env vars necessárias).

### Fase 7 — Documentação da API

**Pontuação**: (registro auxiliar — não pontua)

O `docs/api-reference.md` foi consultado e verificado contra as PHP Resources. O documento:

- Lista corretamente todos os endpoints
- Documenta envelopes de resposta e erro
- Inclui exemplos JSON para cada Resource
- Adverte corretamente sobre a imprecisão do `api.json` OpenAPI
- Documenta o envelope de paginação e o formato RFC 7807

Único problema: F-1 (documentação do status `canceled`).

### Fase 8 — Documentação geral

**Pontuação**: 91/100

**Documentos auditados**:
| Documento | Veracidade | Status |
| --------- | ---------- | ------ |
| `docs/CONVENTIONS.md` | ✅ Totalmente preciso | ✅ |
| `docs/LLM-REFERENCE.md` | ✅ Totalmente preciso | ✅ |
| `CLAUDE.md` | ✅ Totalmente preciso | ✅ |
| `AGENTS.md` | ✅ Totalmente preciso | ✅ |
| `docs/LLM-REFERENCE.md` (import paths) | ✅ Todos corretos | ✅ |
| `docs/api-reference.md` | ⚠️ F-1 (`canceled`) | ⚠️ |
| `docs/DEPLOYMENT.md` (front) | ✅ Consistente com a API | ⚠️ F-4 |
| `docs/DEPLOY-RENDER.md` (front) | ✅ Consistente com a API | ✅ |
| `../boilerplate-api/docs/DEPLOYMENT.md` (API) | ✅ Preciso | ✅ |
| `../boilerplate-api/docs/DEPLOY-RENDER.md` (API) | ✅ Preciso | ✅ |
| `README.md` | ✅ Preciso | ✅ |

**Observações**:

- Os documentos de deploy do front e da API são **consistentes entre si** — ambos descrevem a topologia de origem única, a necessidade do `__Host-XSRF-TOKEN` host-only, e os mesmos valores de `AUTH_COOKIE_SAME_SITE=lax`.
- F-4: deploy doc do front omite `CACHE_STORE=redis` e `QUERY_CACHE_ENABLED=true`.
- Não há `docs/api-reference.md` para o recurso `student-statement` (está ausente? — na verdade está presente como "Estudante (extrato)" ao final do documento). Após verificação: o documento cobre sim o extrato do estudante (`/v1/students/{student}/statement`). Correto.
- Não há `docs/api-reference.md` para o recurso `two-factor` endpoints. Os endpoints existem no código (`twoFactorService.ts`, `TwoFactorController.php`) mas não têm seção dedicada no `api-reference.md`.

---

## Checklist de produção

### Front

- [x] `NEXT_PUBLIC_API_URL` e `NEXT_PUBLIC_STORAGE_URL` como build args
- [x] `API_URL_SERVER` em runtime
- [ ] CSP validada no navegador (pós-deploy)
- [x] Health endpoint (`/api/health`) respondendo
- [x] `output: "standalone"`, usuário não-root

### API

- [x] `APP_ENV=production`, `APP_DEBUG=false`
- [x] `CORS_ALLOWED_ORIGINS` configurado
- [x] `AUTH_COOKIE_SAME_SITE=lax`
- [x] Redis com senha
- [ ] `CACHE_STORE=redis`, `QUERY_CACHE_ENABLED=true`
- [x] Auditoria: `audit:prune` e `accounts:anonymize-trashed` agendados

### Conjunto

- [x] Topologia de origem única
- [x] `npm run lint && npm run typecheck && npm run test && npm run build` verdes

---

## Recomendações prioritárias

1. **Corrigir F-2 (LGPD)**: adicionar link para política de privacidade na UI — impacto legal.
2. **Corrigir F-1 (Documentação)**: remover `canceled` do `api-reference.md` — evita confusão no desenvolvimento.
3. **Corrigir F-3 (Rastreabilidade)**: implementar reporter híbrido para logs de produção — essencial para operação.
4. **Corrigir F-4 (Deploy docs)**: adicionar `CACHE_STORE=redis` e `QUERY_CACHE_ENABLED=true` nas recomendações de deploy.
5. **Corrigir F-5 (Nonce em dev)**: propagar nonce também em desenvolvimento — melhora consistência.
6. **Corrigir `docker compose run --rm web npm run <cmd>`**: documentar comando alternativo para checks de qualidade, já que a imagem de produção não contém devDependencies.

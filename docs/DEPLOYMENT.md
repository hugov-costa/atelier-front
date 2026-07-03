# Guia de produção (front + API)

Instruções para colocar a plataforma em produção: a **API** (`service-fm`, Laravel/Octane)
e o **front** (`serv_front`, Next.js), além de como configurá-los **em conjunto** (cookies,
CORS, CSRF). Ao final há um **checklist** consolidado.

> Os valores de exemplo estão em [`.env.production.example`](../.env.production.example)
> (front) e em `.env.production.example` no repositório da API. Substitua todos os
> `<placeholder>`/domínios.

---

## 1. Topologia

```
Navegador ──HTTPS──> Front (Next.js, :3000)  ──(SSR/proxy)──┐
        └───────────HTTPS────────────────────> API (:8000) ─┼─> PostgreSQL
                                                             ├─> Redis (cache/sessão/fila)
                                                             └─> Object storage (S3/MinIO)
```

- **Mesmo site** (front e API em subdomínios do mesmo domínio registrável, ex.:
  `app.exemplo.com` + `api.exemplo.com`): cookies `SameSite=lax` funcionam.
- **Cross-site** (domínios registráveis diferentes): exige `SameSite=none; Secure` e
  HTTPS nos dois — veja a matriz na seção 4.
- **TLS**: termine HTTPS em um proxy/ingress na frente de ambos. HTTP só atrás do TLS.

---

## 2. API (`service-fm`)

### 2.1 Configuração

1. `cp .env.production.example .env` (ou injete via secrets manager) e preencha tudo.
2. **Pontos críticos** (a aplicação endurece sozinha quando `APP_ENV=production`, mas
   confirme): `APP_ENV=production`, `APP_DEBUG=false`, `APP_KEY` gerado
   (`php artisan key:generate --force`), `CORS_ALLOWED_ORIGINS` com o domínio real do
   front (nunca `*` nem `localhost`), `TELESCOPE_ENABLED=false`, Redis com senha, DB com
   credenciais fortes.
3. Cookie: `AUTH_COOKIE_SECURE` é **forçado a `true` em produção** (config/auth.php),
   independentemente do `.env`. Defina `AUTH_COOKIE_SAME_SITE` conforme a seção 4.

### 2.2 Build e processos

A imagem (FrankenPHP/Octane) já faz, via `docker/entrypoint.sh`: `composer install`,
`key:generate` (se faltar), `app:ensure-database` e `migrate --force` no papel `app`.

- **Web**: `php artisan octane:start --server=frankenphp` (papel `app`).
- **Fila**: um processo `queue:work` (papel `worker`) — necessário para e-mails
  (verificação, reset de senha) e notificações enfileiradas.
- **Agendador**: `schedule:work` (papel `scheduler`) — roda `audit:prune` diariamente.

> **Migrações com múltiplas réplicas**: o entrypoint roda `migrate` a cada boot do papel
> `app`. Com mais de uma réplica, rode as migrações como **passo único de release**
> (um job dedicado) e desligue o migrate automático, para evitar corrida de migração.

### 2.3 Infra gerenciada

- **PostgreSQL**: a busca de usuários usa índice **`pg_trgm`** (migração dedicada).
  Garanta que a extensão pode ser criada (`CREATE EXTENSION pg_trgm`) — em managed DB
  costuma estar na allowlist; caso contrário, crie-a previamente como role com permissão.
- **Redis**: usado para cache (incl. cache de query da listagem), sessão e fila. Exija
  autenticação.
- **Object storage**: crie os buckets `public` e `private`; o `public` deve servir os
  avatares via `MINIO_PUBLIC_URL` (CDN/HTTPS).
- **E-mail**: configure as chaves do provedor (Mailjet) — sem isso, verificação de e-mail
  e reset de senha não saem.

### 2.4 Comandos de release (sugestão)

```bash
php artisan config:cache      # lê o .env e congela a config (rode no deploy)
php artisan route:cache
php artisan event:cache
php artisan migrate --force   # como passo único; ver 2.2
```

> Depois de `config:cache`, alterações no `.env` só valem após novo `config:cache`.

---

## 3. Front (`serv_front`)

### 3.1 Variáveis

- **Build-time** (embutidas): `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_STORAGE_URL` — passe
  como **build args** (`docker build --build-arg ...` / `args:` no compose). O Dockerfile
  as promove a `ENV` antes do `next build`.
- **Runtime**: `API_URL_SERVER` (lida pelo `proxy.ts`) — pode ser um endereço interno do
  cluster. Defina no ambiente do container.

### 3.2 Build e execução

```bash
docker build \
  --build-arg NEXT_PUBLIC_API_URL=https://api.exemplo.com/api/v1 \
  --build-arg NEXT_PUBLIC_STORAGE_URL=https://storage.exemplo.com \
  -t serv-front .

docker run -p 3000:3000 \
  -e API_URL_SERVER=https://api.exemplo.com/api/v1 \
  serv-front
```

A imagem é `output: "standalone"`, roda como usuário não-root e expõe `:3000`.

### 3.3 Probes

- **Liveness**: `GET /api/health` → `{ "status": "ok" }` (não passa pela guarda de
  rotas, não depende da API).
- **Readiness**: a aplicação depende da API; use `/api/health` para liveness e monitore a
  API separadamente.

### 3.4 Cabeçalhos e CSP

Headers estáticos vêm do `next.config` e a **CSP com nonce** do `proxy.ts` (estrita em
produção). A CSP libera `connect-src`/`img-src` para as origens de `NEXT_PUBLIC_API_URL`
e `NEXT_PUBLIC_STORAGE_URL` — por isso elas precisam ser as **origens reais** no build.

---

## 4. Em conjunto — cookies, CORS, CSRF

| Cenário                         | `AUTH_COOKIE_SAME_SITE` | `AUTH_COOKIE_SECURE` | `CORS_ALLOWED_ORIGINS` | Observação                                                  |
| ------------------------------- | ----------------------- | -------------------- | ---------------------- | ----------------------------------------------------------- |
| Mesmo site (subdomínios)        | `lax`                   | `true`               | origem do front        | Mais simples e robusto.                                     |
| Cross-site (domínios distintos) | `none`                  | `true`               | origem do front        | Exige HTTPS nos dois; sem isso o browser descarta o cookie. |

- O front chama a API **direto do browser** com `credentials: include`; o `proxy.ts`
  apenas guarda rotas no servidor.
- O fluxo CSRF (`GET /sanctum/csrf-cookie` → `X-XSRF-TOKEN`) já está com CORS liberado.
- `X-Request-Id` é exposto pela API e relido pelo front para correlação de logs.

---

## 5. Verificação pós-deploy (smoke)

1. **Headers**: rode o domínio do front no [securityheaders.com](https://securityheaders.com)
   e no Mozilla Observatory; confirme CSP, HSTS, `X-Frame-Options`.
2. **API saudável**: `curl https://api.exemplo.com/api/v1/health` → `200` com
   `status: ok`.
3. **Front vivo**: `curl https://app.exemplo.com/api/health` → `200`.
4. **Fluxo real**: registrar → login → acessar a conta → logout no navegador (o cookie
   deve persistir; sem erro de CORS/CSRF no console).
5. **Sem debug**: confirme que um erro da API retorna Problem JSON **sem stack trace**.
6. **E-mail**: dispare uma verificação/reset e confirme a entrega.

---

## 6. Checklist de produção

### API

- [ ] `APP_ENV=production`, `APP_DEBUG=false`, `APP_KEY` gerado.
- [ ] `CORS_ALLOWED_ORIGINS` = origem real do front (sem `localhost`/`*`).
- [ ] `FRONTEND_URL` = URL real do front (usado nos links de e-mail).
- [ ] `AUTH_COOKIE_SAME_SITE` conforme a matriz (seção 4); HTTPS ativo.
- [ ] `TELESCOPE_ENABLED=false`; Pulse só se necessário (é admin-gated).
- [ ] Redis com senha; DB com credenciais fortes vindas de secret store.
- [ ] `pg_trgm` disponível no PostgreSQL.
- [ ] Buckets `public`/`private` criados; `MINIO_PUBLIC_URL` em HTTPS/CDN.
- [ ] Credenciais de e-mail (Mailjet) válidas.
- [ ] Processos `worker` e `scheduler` em execução.
- [ ] Migrações como passo único de release (se houver múltiplas réplicas).
- [ ] `config:cache` + `route:cache` + `event:cache` no build.
- [ ] Primeiro admin criado deliberadamente (seeder/console — registro só cria não-admin).

### Front

- [ ] `NEXT_PUBLIC_API_URL` e `NEXT_PUBLIC_STORAGE_URL` passados como **build args** (HTTPS).
- [ ] `API_URL_SERVER` no ambiente de runtime.
- [ ] HTTPS terminado na frente; `/api/health` respondendo.
- [ ] CSP validada no navegador (sem violações no console em produção).

### Conjunto / processo

- [ ] `npm run lint && npm run typecheck && npm run test && npm run build` verdes (front).
- [ ] `pint --test`, `phpstan` (level max) e `php artisan test` verdes (API).
- [ ] SAST (Semgrep) rodando no CI dos dois repos (job `sast`, report-only por padrão —
      torne-o bloqueante removendo `continue-on-error` quando estiver afinado) + scan de
      dependências (`npm audit` / `composer audit`).
- [ ] Scan de cabeçalhos de segurança.
- [ ] Teste de carga (k6/Artillery) na API com Octane antes de confiar no throughput.
- [ ] (Recomendado) pentest leve focado em authz/IDOR e lógica de negócio.
- [ ] Backups de DB e object storage configurados e testados.
- [ ] Observabilidade: logs centralizados, alertas em `/health` e na fila.

---

## 7. Rollback

- **Front**: redeploy da imagem anterior (stateless).
- **API**: redeploy da imagem anterior; para migrações, prefira mudanças compatíveis com
  a versão anterior (expand/contract) para permitir rollback sem perda. `migrate:rollback`
  apenas se a migração for reversível e nenhuma réplica nova já depender do novo schema.

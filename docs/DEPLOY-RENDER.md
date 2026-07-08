# Deploy do front no Render — Passo a Passo

Guia para colocar o **front** (`serv_front`, Next.js) em produção, adaptado do
guia da API (`../boilerplate-api/docs/DEPLOY-RENDER.md`). Assume que a **API já
está no ar** (siga o guia da API primeiro).

> Para a referência técnica consolidada (front + API + cookies/CORS/CSRF) veja
> [`DEPLOYMENT.md`](DEPLOYMENT.md). Este documento é o passo a passo do front.

---

## Antes de começar

Você vai precisar:

- [ ] A **API já publicada** (Web Service no Render) e respondendo em
      `https://<sua-api>.onrender.com/api/v1/health` com `status: ok`.
- [ ] **Conta no GitHub** com o repositório do front (`serv_front`).
- [ ] **Conta no Render** (a mesma da API, de preferência — mesma região reduz latência).
- [ ] **Um domínio** (ex.: `meuatelier.com.br`). É **necessário** para a topologia
      recomendada abaixo (o `onrender.com` gratuito não resolve a questão dos cookies).

---

## Passo 0 (o mais importante): entenda a topologia

Este front **não** funciona se for publicado em um domínio separado da API
(nem em subdomínios `app.` + `api.`, nem cross-site tipo Vercel+Render). O motivo
é concreto e está no código:

1. O guarda de rotas server-side ([`proxy.ts`](../src/proxy.ts)) lê o cookie de
   sessão `access_token` a cada requisição para decidir se redireciona ao login.
2. O cliente HTTP ([`api-client.ts`](../src/lib/api-client.ts)) lê o cookie
   `__Host-XSRF-TOKEN` do `document.cookie` no navegador para preencher o header
   `X-XSRF-TOKEN` (proteção CSRF _double-submit_).

Em produção a API emite o cookie CSRF com o prefixo **`__Host-`**, que por
especificação **proíbe** o atributo `Domain` — ou seja, o cookie é **host-only**
e só é visível para o **mesmo host** que o emitiu. Logo, o JavaScript do front só
consegue lê-lo se **front e API forem servidos pela mesma origem**.

> **Regra de ouro**: em produção, o navegador deve enxergar o front e a API na
> **mesma origem** (mesmo `https://host`). Caso contrário, o login funciona mas
> **toda mutação falha com `419`** (o front não consegue ler o token CSRF) e o
> guarda SSR trata todo mundo como deslogado.

### Como obter a mesma origem

Publique **uma única origem pública** (ex.: `https://meuatelier.com.br`) que roteie:

| Caminho                                   | Destino              |
| ----------------------------------------- | -------------------- |
| `/api/*` e `/sanctum/*`                   | serviço da **API**   |
| todo o resto (`/`, `/login`, `/users`, …) | serviço do **front** |

Duas formas de fazer isso (escolha uma):

- **Opção A — Roteador na borda (recomendada, sem alterar código):** coloque um
  reverse proxy em um único domínio e roteie por caminho. Nenhuma mudança no front.
  Exemplo nginx:

  ```nginx
  server {
    server_name meuatelier.com.br;
    location ~ ^/(api|sanctum)/ { proxy_pass https://<sua-api>.onrender.com; proxy_set_header Host $host; }
    location / { proxy_pass https://serv-front.onrender.com; proxy_set_header Host $host; }
  }
  ```

  Alternativa gerenciada: **Cloudflare Origin Rules** (roteia `/api/*` e `/sanctum/*`
  para o host da API e o resto para o host do front). `NEXT_PUBLIC_API_URL` vira a
  origem única (`https://meuatelier.com.br/api/v1`).

- **Opção B — Rewrites do Next (mantém só o front público, exige 2 ajustes):** o
  próprio front encaminha `/api/v1/*` e `/sanctum/*` para a API. Requer:
  1. `async rewrites()` no [`next.config.ts`](../next.config.ts) apontando para a URL da API;
  2. expor essa URL como **build arg** no `Dockerfile` (os destinos de `rewrites` são
     resolvidos em **build**, não em runtime — daí precisar da URL no build, além do
     `API_URL_SERVER` de runtime usado pelo `proxy.ts`).

  > Os rewrites usam `/api/v1/*` (não `/api/*`), então não conflitam com a rota
  > própria `/api/health` do front.

Este guia segue a **Opção A** (roteador na borda) por não exigir mudança de código.
Onde os passos citam a "origem única", é o domínio do roteador.

---

## Passo 1: Preparar as variáveis de ambiente

O front tem **dois tipos** de variável:

- **Build-time** (`NEXT_PUBLIC_*`): embutidas no bundle durante o `next build`. O
  Dockerfile as declara como `ARG`; **no Render, uma env var com o mesmo nome de um
  `ARG` é injetada automaticamente no build.**
- **Runtime**: lidas pelo servidor Next em execução.

Prepare esta lista (troque `meuatelier.com.br` pelo seu domínio):

```env
NODE_ENV=production

# Build-time (embutidas no bundle) — DEVE ser a origem pública ÚNICA (o domínio do
# roteador da borda), pois o navegador chamará a API por aqui e o roteador encaminha.
NEXT_PUBLIC_API_URL=https://meuatelier.com.br/api/v1
# Origem pública do storage de imagens (bucket público do R2/MinIO da API).
NEXT_PUBLIC_STORAGE_URL=https://pub-<hash>.r2.dev

# Runtime — usada pelo proxy.ts (SSR) para validar a sessão na API (server-to-server;
# encaminha os cookies do request). Pode ser a URL direta/privada da API no Render.
API_URL_SERVER=https://<sua-api>.onrender.com/api/v1
```

**⚠️ Coerência com a API** (confira no `.env` da API):

| Front                                                 | Deve casar com a API                    |
| ----------------------------------------------------- | --------------------------------------- |
| Origem pública do front (`https://meuatelier.com.br`) | `CORS_ALLOWED_ORIGINS` e `FRONTEND_URL` |
| `NEXT_PUBLIC_STORAGE_URL`                             | `MINIO_PUBLIC_URL`                      |
| Cookies same-site (mesma origem)                      | `AUTH_COOKIE_SAME_SITE=lax`             |

> Como front e API ficam na **mesma origem**, o CORS deixa de ser um problema
> (as chamadas são same-origin); ainda assim mantenha `CORS_ALLOWED_ORIGINS` com a
> origem real, nunca `*` nem `localhost`.

---

## Passo 2: Push do código para o GitHub

No terminal, na pasta do front:

```bash
git add .
git commit -m "chore: configura deploy de produção do front"
git push origin main
```

---

## Passo 3: Criar o Web Service (front) no Render

1. No dashboard do Render, **"New +"** → **"Web Service"**.
2. **Connect repository**: escolha `serv_front`.
3. Preencha:
   - **Name**: `serv-front`
   - **Region**: a **mesma da API** (ex.: `São Paulo (South America)`).
   - **Branch**: `main`
   - **Runtime**: `Docker` (o Render detecta o `Dockerfile`).
   - **Plan**: `Starter` (US$7/mês, 512MB) — suficiente para começar.
4. Em **"Environment Variables"**, adicione **todas** as do Passo 1
   (`NODE_ENV`, `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_STORAGE_URL`, `API_URL_SERVER`).
   - As `NEXT_PUBLIC_*` precisam existir **antes do build** — no Render elas já ficam
     disponíveis no build e alimentam os `ARG` de mesmo nome do Dockerfile.
5. **Health Check Path**: `/api/health` (o front responde `{ "status": "ok" }` aí,
   sem passar pela guarda de rotas).
6. **"Create Web Service"**.

A imagem é `output: "standalone"`, roda como usuário não-root (`nextjs`) e o servidor
Next honra a porta via `PORT`/`HOSTNAME=0.0.0.0` (o Render injeta `PORT`
automaticamente). O build leva ~5-10 min na primeira vez.

Quando terminar, o front estará em `https://serv-front.onrender.com`.

---

## Passo 4: Configurar o domínio único (crucial)

Para satisfazer a topologia de **mesma origem** (Passo 0, Opção A), o domínio público
`meuatelier.com.br` fica no **roteador da borda**, que distribui:

- `/api/*` e `/sanctum/*` → serviço da **API** (`https://<sua-api>.onrender.com`);
- todo o resto → serviço do **front** (`https://serv-front.onrender.com`).

Passos:

1. Aponte o DNS de `meuatelier.com.br` para o roteador (Cloudflare/nginx/ingress).
2. Configure as regras de roteamento por caminho (ex.: nginx do Passo 0, ou
   **Cloudflare Origin Rules**).
3. Garanta HTTPS no roteador (Cloudflare/Let's Encrypt) — HTTP só atrás do TLS.

Assim, os serviços do Render (front e API) podem ficar nos `*.onrender.com`; o público
só enxerga `meuatelier.com.br`.

> **Se preferir a Opção B (rewrites do Next)**: aí só o **front** precisa de domínio
> público (custom domain no Render), a API pode ser um _Private Service_, e os rewrites
> encaminham `/api/v1` e `/sanctum` — lembrando dos 2 ajustes do Passo 0.

---

## Passo 5: Ajustar a API para a origem do front

No serviço da **API** no Render, confirme/atualize as env vars e re-deploy:

```env
APP_ENV=production
CORS_ALLOWED_ORIGINS=https://meuatelier.com.br
FRONTEND_URL=https://meuatelier.com.br
AUTH_COOKIE_SAME_SITE=lax          # mesma origem/site
# AUTH_COOKIE_SECURE é forçado a true quando APP_ENV=production
```

> **Não** use `SESSION_DOMAIN` para tentar compartilhar cookies entre domínios
> diferentes: o cookie CSRF usa o prefixo `__Host-`, que é incompatível com
> `Domain`. A abordagem correta é a mesma origem (Passo 0).

---

## Passo 6: Verificação pós-deploy (smoke test)

1. **Front vivo**: `curl https://meuatelier.com.br/api/health` → `200` com `status: ok`.
2. **API acessível pela mesma origem** (via roteador):
   `curl https://meuatelier.com.br/api/v1/health` → `200` com `status: ok`.
3. **Cabeçalhos de segurança**: rode `https://meuatelier.com.br` no
   [securityheaders.com](https://securityheaders.com) e no Mozilla Observatory —
   confirme CSP (com nonce), HSTS, `X-Frame-Options: DENY`.
4. **Fluxo real no navegador** (o teste que pega problemas de cookie/CSRF):
   - Faça **login** → deve entrar no dashboard sem erro no console.
   - Faça uma **mutação** (ex.: editar o próprio perfil) → deve funcionar
     (se der `419`, a origem não está unificada — revise o Passo 0).
   - **Recarregue** uma rota protegida → não deve cair no login (guarda SSR lê o
     `access_token`).
   - **Logout** → volta ao login.
5. **Sem debug**: force um erro de API e confirme que a resposta é Problem JSON
   **sem stack trace**.

---

## Passo 7: Criar o primeiro usuário master

Não há auto-registro. O primeiro usuário é criado **uma única vez** direto na API
(veja o guia da API). Depois, dentro do painel, o master cria os demais usuários e
cada um define a senha pelo link de e-mail (`/set-password`).

```bash
curl -X POST https://meuatelier.com.br/api/v1/users/master \
  -H "Content-Type: application/json" \
  -d '{"name":"Administrador","email":"admin@meuatelier.com.br","password":"Minha@Senha123","password_confirmation":"Minha@Senha123"}'
```

---

## Como a integração funciona (resumo técnico)

```
                 https://meuatelier.com.br  (uma origem)
Navegador ──────────────────┬───────────────────────────────►  Front (Next.js)
   │                        │  /api/v1/*, /sanctum/*  (rewrite/roteador)
   │                        └───────────────────────────────►  API (Laravel)
   │
   ├─ Páginas e navegação: servidas pelo front; o proxy.ts guarda as rotas lendo
   │  o cookie `access_token` (mesma origem → cookie visível no SSR).
   └─ Dados: o browser chama `/api/v1/*` na MESMA origem; a API responde e seta
      `access_token` + `__Host-XSRF-TOKEN` host-only nessa origem → o front lê o
      token CSRF e o reenvia em `X-XSRF-TOKEN` nas mutações (double-submit).
```

- **CSRF**: `GET /sanctum/csrf-cookie` (semeado no login) → cookie `__Host-XSRF-TOKEN`
  → header `X-XSRF-TOKEN` em cada `POST/PUT/PATCH/DELETE`. Só funciona same-origin.
- **Cookies**: `access_token` e `__Host-XSRF-TOKEN` têm validade de 14 dias
  (`AUTH_COOKIE_LIFETIME`), `Secure` forçado em produção, `SameSite=lax`.
- **Rastreabilidade**: o front envia `X-Request-Id` (client e SSR) e relê o valor
  ecoado pela API.

---

## Resumo de custos mensais (só o front)

| Serviço             | Plano   | Custo (USD) |
| ------------------- | ------- | ----------- |
| Web Service (front) | Starter | $7          |

Somado à API (veja o guia da API), a plataforma completa fica em torno de **~$36/mês**.
No plano gratuito do Render o serviço "hiberna" após 15 min sem uso — só para testes.

---

## Problemas comuns

**❌ Toda mutação retorna `419` (CSRF token mismatch)**
→ Front e API **não** estão na mesma origem. O `__Host-XSRF-TOKEN` da API é host-only
e o front não consegue lê-lo. Reveja o Passo 0 (rewrites ou roteador na borda) e
garanta que `NEXT_PUBLIC_API_URL` é a **origem do front**.

**❌ Rotas protegidas sempre caem no login (mesmo logado)**
→ O guarda SSR não está enxergando o `access_token`. Mesma causa acima: origem não
unificada. Confirme que as chamadas de API passam pela origem do front.

**❌ Imagens/avatares não carregam**
→ `NEXT_PUBLIC_STORAGE_URL` (front) precisa ser igual ao `MINIO_PUBLIC_URL` (API) e
estar na allowlist do `next/image` (o `remotePatterns` é montado a partir dessa env).
Reveja também `img-src` na CSP (já inclui a origem de `NEXT_PUBLIC_STORAGE_URL`).

**❌ Erro de CORS no console**
→ Não deveria ocorrer na topologia same-origin. Se ocorrer, alguma chamada está indo
para um host diferente do front — confira `NEXT_PUBLIC_API_URL`.

**❌ O build falha por falta de `NEXT_PUBLIC_*`**
→ Elas são **build-time**. No Render, adicione-as como env vars **antes** de criar o
serviço (elas alimentam os `ARG` do Dockerfile). Rebuild após corrigir.

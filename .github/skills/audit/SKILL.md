---
name: audit
description: "Auditoria profunda e detalhada do projeto serv_front. Verifica segurança, performance, qualidade de código, LGPD, ferramentas, contratos de API e veracidade da documentação. Use quando: o usuário pedir auditoria, revisão, code review, verificação de segurança, checagem de qualidade, análise de LGPD, validação de contratos de API."
user-invocable: true
---

# Auditoria — serv_front

Auditoria aprofundada do projeto. **Velocidade é secundária** — o foco é:
segurança, performance, qualidade de código, LGPD e funcionamento das ferramentas.

## ⚠️ Regras fundamentais

1. **Nada pode ser assumido sem verificação.** Consulte o código real, a API real, os arquivos reais. Desconfie de comentários e documentação — verifique a veracidade de cada afirmação.
2. **Tudo o que exigir conhecimento da API** deve ser consultado no projeto da API (`atelier`). Não adivinhe contratos, comportamentos ou campos.
3. **Cada arquivo relevante deve ser lido** antes de se tirar conclusões. Não confie em sumários ou visões parciais.
4. **A fonte da verdade para contratos de API são as PHP Resources** em `../boilerplate-api/app/Http/Resources/*.php`. Consulte o método `toArray()` de cada Resource — ele define exatamente o que a API retorna. **Nunca confie no `api.json`** (arquivo OpenAPI gerado automaticamente): ele frequentemente está desatualizado, omite campos (ex.: `whenLoaded()` não aparece no JSON gerado), distorce tipos (ex.: `integer` vs `string` em campos calculados por services) e leva a conclusões incorretas. Se precisar verificar o tipo numérico de um campo, consulte também os casts do model em `app/Models/*.php` (ex.: `protected $casts = ['price' => 'integer']`).
5. **Toda falha encontrada deve ser detalhada** com: o que é, onde está, por que é um problema, qual o risco, como corrigir, **e quantos pontos reduz na pontuação**.
6. **Os documentos de deploy devem ser auditados** tanto quanto o código fonte. Leia `docs/DEPLOYMENT.md`, `docs/DEPLOY-RENDER.md` (front) e `../boilerplate-api/docs/DEPLOYMENT.md`, `../boilerplate-api/docs/DEPLOY-RENDER.md` (API). Verifique consistência entre eles, contradições, instruções incorretas ou desatualizadas.
7. **Teste com os containers em execução.** O projeto é totalmente dockerizado. Sempre que a avaliação exigir verificação de comportamento em runtime (ex.: fluxo de autenticação, CSP real, comportamento de proxy, renderização de páginas, integração com API), **subo os containers do Docker** com `docker compose up -d` (a partir da raiz do front — o `docker-compose.yml` já inclui o backend, que será upado junto). Teste contra a aplicação real no navegador. A leitura de código estática não substitui a observação do comportamento em execução.
8. **Testes e ferramentas rodam dentro do container Docker.** O projeto não tem Node.js instalado no ambiente host — `npm`, `node` e ferramentas como ESLint, Vitest, TypeScript e Next.js só estão disponíveis **dentro do container**. Para executar qualquer comando de teste/qualidade, use:
   ```bash
   docker compose run --rm web npm run <comando>
   ```
   Ou, se os containers já estiverem em execução:
   ```bash
   docker compose exec web npm run <comando>
   ```
   Exemplos:
   - `docker compose run --rm web npm run test`
   - `docker compose run --rm web npm run lint`
   - `docker compose run --rm web npm run typecheck`
   - `docker compose run --rm web npm run build`
   - `docker compose run --rm web npm run format:check`
     Nunca tente rodar `npm` diretamente no host — vai falhar com `command not found`.

## Procedimento

Siga cada fase em ordem. Não pule fases. Documente descobertas num arquivo de relatório.

---

### Fase 1: Contratos de API (validação crítica)

1. Identifique todos os endpoints consumidos em `src/services/` e `src/lib/server-prefetch.ts`.
2. Para cada endpoint, consulte a API real (projeto `atelier`). **A fonte primária de verdade** são os arquivos em `../boilerplate-api/app/Http/Resources/*.php` (método `toArray()`). Consulte também os controllers em `../boilerplate-api/app/Http/Controllers/` para URL, método HTTP e parâmetros de query aceitos. **Ignare o `api.json`** — ele é gerado automaticamente e com frequência está desatualizado ou impreciso. Verifique:
   - URL e método HTTP (controllers → route definitions)
   - Parâmetros de query esperados (`page`, `perPage`, `search`, `sort`, `direction`, etc.)
   - Estrutura de resposta (`toArray()` da Resource → campos, tipos, `whenLoaded()`)
   - Tipos numéricos: consulte os casts do model em `../boilerplate-api/app/Models/*.php` (ex.: `$casts = ['price' => 'integer']`)
   - Schemas zod em `src/lib/responseSchemas.ts` — cada campo bate com o que a Resource retorna?
   - Tratamento de erros (Problem JSON, campos de validação, status HTTP)
3. Liste divergências entre o que o front supõe e o que a API realmente retorna.

### Fase 2: Segurança

> ⚡ Suba os containers (`docker compose up -d`) e teste o comportamento real no navegador e nos headers HTTP.
> ⚡ Leia também os documentos de deploy (`docs/DEPLOYMENT.md`, `docs/DEPLOY-RENDER.md`, `../boilerplate-api/docs/DEPLOYMENT.md`, `../boilerplate-api/docs/DEPLOY-RENDER.md`) — eles contêm configurações de segurança (CSP, CORS, cookies, HSTS) que podem divergir da implementação.

1. **CSP (Content Security Policy)**
   - Leia `src/proxy.ts` — a CSP é gerada corretamente?
   - Em produção: `'strict-dynamic'` com nonce?
   - Em dev: modo relaxado para HMR?
   - Os `connect-src` e `img-src` incluem as origens corretas?
   - **Verifique em runtime**: inspecione os headers de resposta no navegador ou via `curl -I https://<url>` para confirmar que a CSP está sendo emitida conforme o esperado.
2. **Autenticação e proxy**
   - Leia `src/proxy.ts` — a guarda de rotas funciona?
   - O `auth-cache` tem TTL adequado? Vaza tokens?
   - Rotas de autenticação redirecionam usuários logados?
   - Rotas protegidas redirecionam não autenticados?
3. **CSRF**
   - Leia `src/lib/api-client.ts` — o fluxo de CSRF está correto?
   - `__Host-XSRF-TOKEN` em produção, fallback para `XSRF-TOKEN` em dev?
   - Toda mutação chama `requestCsrfCookie()` antes?
4. **Cabeçalhos HTTP**
   - Leia `next.config.ts` — `X-Content-Type-Options`, `X-Frame-Options`, `HSTS`, `Referrer-Policy`, `Permissions-Policy` estão configurados?
5. **Exposição de informação**
   - Erros da API vazam stack trace em produção?
   - Variáveis `NEXT_PUBLIC_*` expõem algo sensível?
6. **Dependências**
   - Verifique `package.json` por dependências com vulnerabilidades conhecidas.
   - Há `npm audit` rodando no CI?

### Fase 3: LGPD

1. **Dados pessoais no front**
   - Onde `name`, `email` e outros dados pessoais são exibidos? Há exposição indevida?
   - Logs/client-side captureError podem conter dados pessoais?
2. **Eliminação de dados (direito ao esquecimento)**
   - Leia `src/services/userService.ts` — função `eraseUser` existe? Está acessível via UI?
   - A UI expõe claramente a opção de eliminação de dados?
3. **Consentimento e comunicação**
   - Há aviso claro sobre tratamento de dados?
   - O usuário consegue ver/baixar seus próprios dados?
4. **Retenção mínima**
   - Dados de auditoria são podados (ex.: `audit:prune`)?
   - Cookies têm tempo de vida adequado?

### Fase 4: Performance

1. **Server-side prefetch**
   - Leia `src/app/(dashboard)/` — todas as páginas usam prefetch adequado?
   - `staleTime` de 30s no `makeServerQueryClient` é adequado?
2. **Bundle e imports**
   - Há imports pesados e desnecessários? `lucide-react` e `radix-ui` estão otimizados?
   - Componentes shadcn são tree-shakeable?
3. **Renderização**
   - Componentes client têm `"use client"` só quando necessário?
   - Páginas usam server components sempre que possível?
4. **Imagens**
   - `remotePatterns` em `next.config.ts` cobrem as origens necessárias?
   - Avatares usam `next/image` com tamanhos adequados?
5. **TanStack Query**
   - `keepPreviousData` está sendo usado em listagens?
   - As queries têm `staleTime` e `gcTime` adequados?
   - `enabled` para gate de permissão evita chamadas desnecessárias?

### Fase 5: Qualidade de código

> ⚡ Todos os comandos abaixo devem ser executados **dentro do container Docker**: `docker compose run --rm web npm run <comando>`.

1. **Tipagem**
   - Há uso de `any` em algum lugar? (grep: `: any`, `as any`, `// @ts-`)
   - Os schemas zod cobrem todos os campos da API?
2. **ESLint e formatação**
   - Há `eslint-disable` em algum lugar? (grep: `eslint-disable`)
   - Rode `npm run lint` — tudo passa?
   - Rode `npm run format:check` — tudo formatado?
3. **Testes**
   - `npm run test` passa?
   - Há testes para services, utils, schemas?
   - `npm run typecheck` passa com `tsconfig.typecheck.json`?
4. **Cobertura de erros**
   - Toda mutation trata `onError` com toast?
   - Toda query em página protegida tem `enabled` com permissão?
   - `captureError` é chamado nos lugares certos?
5. **Build**
   - `npm run build` passa sem erros?

### Fase 6: Funcionamento das ferramentas

> ⚡ Confirme que `docker compose build` passa limpo antes de prosseguir.
> ⚡ Lembre-se: comandos como `npm run lint`, `npm run test` etc. rodam **dentro do container**.

1. **Git hooks**
   - Leia `.husky/pre-commit` e `.husky/commit-msg` — estão funcionais?
   - O `verify-commit-msg.mjs` valida Conventional Commits corretamente?
2. **CI**
   - Leia `.github/workflows/` — os workflows estão corretos?
   - Rodam lint, typecheck, test e build?
3. **Scripts**
   - `scripts/integration-test.mjs` e `scripts/features-test.mjs` estão atualizados?
4. **Docker**
   - Leia `Dockerfile` e `docker-compose.yml` — a imagem de produção está correta?
   - `output: "standalone"` no Next.js?
   - Usuário não-root?
   - **Build em container**: rode `docker compose build` e verifique se completa sem erros. Depois suba com `docker compose up -d` e acesse a aplicação no navegador para confirmar que inicializa corretamente.

### Fase 7: Documentação da API (registro auxiliar)

> ⚡ Esta fase é complementar e independente das demais. Seu objetivo é construir um **registro auxiliar** com os contratos da API para facilitar operações futuras (consultas rápidas, automações, scripts de teste).

1. Consulte a API real (projeto `atelier`) — **sempre as PHP Resources** em `../boilerplate-api/app/Http/Resources/*.php` como fonte da verdade, **nunca o `api.json`**. Documente, para cada recurso:
   - **URL base** e prefixo (ex.: `/api/v1/...`)
   - **Endpoints principais**: listagem, detalhe, criação, atualização, exclusão
   - **Parâmetros de query** aceitos (`page`, `perPage`, `search`, `sort`, `direction`, `filters`, etc.)
   - **Corpo da requisição** (create/update): campos obrigatórios e opcionais, tipos, exemplos
   - **Estrutura de resposta**: extraia do `toArray()` da Resource — formato do objeto, envelope de paginação (`data`, `meta`, etc.), campos condicionais (`whenLoaded()`)
   - **Códigos de erro** esperados (HTTP status + Problem JSON)
2. Identifique **operações simples** que podem ser facilitadas com esse registro:
   - Scripts de seed/população de dados para teste
   - Chamadas cURL ou HTTP client snippets para validação manual
   - Mapeamento de enums e constantes compartilhadas
3. Salve o resultado em um arquivo organizado (ex.: `docs/api-reference.md`) para consulta durante a auditoria e sessões futuras.

---

### Fase 8: Documentação (veracidade e completude)

> ⚡ Esta fase inclui também os **documentos de deploy** do front e da API.
> Leia **todos** os documentos de documentação e deploy, não apenas os do front.

1. **Veracidade**
   - Leia `docs/CONVENTIONS.md`, `docs/LLM-REFERENCE.md`, `CLAUDE.md`, `AGENTS.md`, `README.md`, `docs/DEPLOYMENT.md`, `docs/DEPLOY-RENDER.md`
   - Leia os docs de deploy da API: `../boilerplate-api/docs/DEPLOYMENT.md`, `../boilerplate-api/docs/DEPLOY-RENDER.md`
   - Para cada afirmação sobre código ou configuração, verifique no código real se é verdade.
   - **Cruze os docs de deploy**: as instruções do front e da API são consistentes entre si? Existem contradições sobre topologia (`AUTH_COOKIE_SAME_SITE`, `CORS_ALLOWED_ORIGINS`, etc.)?
   - Exemplos de URLs, domínios e valores de exemplo são coerentes com a arquitetura real?
   - Liste discrepâncias entre documentação e implementação.
2. **Import paths**
   - Os import paths em `docs/LLM-REFERENCE.md` estão corretos?
   - Novos services/hooks foram criados mas não documentados?
3. **Completude**
   - Toda funcionalidade implementada está documentada?
   - `docs/api-reference.md` cobre **todos** os endpoints consumidos?
   - Faltam instruções para o que o projeto faz?

---

## Sistema de Pontuação (Scoring)

Atribua uma pontuação de **0 a 100** para cada seção e uma **pontuação geral**.

### Metodologia

- **0** = projeto absolutamente podre, inseguro, sem qualidade
- **100** = projeto perfeito, impecável em todos os aspectos
- Cada falha reduz a pontuação de acordo com sua severidade:

| Severidade  | Dedução por falha | Descrição                                                                                                           |
| ----------- | ----------------- | ------------------------------------------------------------------------------------------------------------------- |
| CRÍTICA     | −15 a −25 pontos  | Vulnerabilidade explorável, quebra total de funcionalidade, vazamento de dados sensíveis, impossibilidade de deploy |
| ALTA        | −8 a −12 pontos   | Risco significativo, perda de funcionalidade, config que leva a falha certa em produção                             |
| MÉDIA       | −3 a −6 pontos    | Problema real com impacto delimitado, documentação contraditória, performance subótima                              |
| BAIXA       | −1 a −2 pontos    | Boa prática não seguida, documentação desatualizada, melhoria cosmética                                             |
| INFORMATIVO | 0 pontos          | Observação, não reduz pontuação                                                                                     |

### Cálculo

1. Cada seção começa com **100 pontos**.
2. Subtraia as deduções de cada falha da seção.
3. A **pontuação geral** é a média ponderada das seções:
   - Segurança: peso 3
   - Contratos de API: peso 2
   - LGPD: peso 2
   - Qualidade de código: peso 2
   - Performance: peso 1
   - Ferramentas: peso 1
   - Documentação (incl. deploy): peso 1

   `geral = (segurança×3 + api×2 + lgpd×2 + qualidade×2 + perf×1 + ferram×1 + docs×1) / 12`

4. Arredonde para inteiro mais próximo.

### Apresentação

No resumo do relatório, inclua:

```markdown
## Resumo

- **Pontuação geral**: XX/100
- **Total de falhas**: N
- **Críticas**: N | **Altas**: N | **Médias**: N | **Baixas**: N

### Pontuação por seção

| Seção               | Pontuação | Peso |
| ------------------- | --------- | ---- |
| Segurança           | XX/100    | ×3   |
| Contratos de API    | XX/100    | ×2   |
| LGPD                | XX/100    | ×2   |
| Qualidade de código | XX/100    | ×2   |
| Performance         | XX/100    | ×1   |
| Ferramentas         | XX/100    | ×1   |
| Documentação        | XX/100    | ×1   |
```

No detalhe de cada falha, inclua o campo **`- **Pontuação**: −X pontos`** indicando quanto aquela falha específica reduz na seção correspondente.

## Relatório de auditoria

Ao final, produza um relatório em markdown com:

```markdown
# Relatório de Auditoria — serv_front

## Resumo

- **Pontuação geral**: XX/100
- **Total de falhas**: N
- **Críticas**: N | **Altas**: N | **Médias**: N | **Baixas**: N

### Pontuação por seção

| Seção               | Pontuação | Peso |
| ------------------- | --------- | ---- |
| Segurança           | XX/100    | ×3   |
| Contratos de API    | XX/100    | ×2   |
| LGPD                | XX/100    | ×2   |
| Qualidade de código | XX/100    | ×2   |
| Performance         | XX/100    | ×1   |
| Ferramentas         | XX/100    | ×1   |
| Documentação        | XX/100    | ×1   |

## Falhas encontradas

### F-[ID] — [Título] (CRÍTICA/ALTA/MÉDIA/BAIXA)

- **Onde**: arquivo, linha
- **Problema**: descrição clara
- **Risco**: impacto potencial
- **Correção**: passo a passo ou sugestão de código
- **Pontuação**: −X pontos
- **Prioridade**: (recomendado) / opcional
```

Cada falha deve ser acionável — um desenvolvedor deve conseguir ler e corrigir sem ambiguidade.

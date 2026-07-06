---
name: audit
description: 'Auditoria profunda e detalhada do projeto serv_front. Verifica segurança, performance, qualidade de código, LGPD, ferramentas, contratos de API e veracidade da documentação. Use quando: o usuário pedir auditoria, revisão, code review, verificação de segurança, checagem de qualidade, análise de LGPD, validação de contratos de API.'
user-invocable: true
---

# Auditoria — serv_front

Auditoria aprofundada do projeto. **Velocidade é secundária** — o foco é:
segurança, performance, qualidade de código, LGPD e funcionamento das ferramentas.

## ⚠️ Regras fundamentais

1. **Nada pode ser assumido sem verificação.** Consulte o código real, a API real, os arquivos reais. Desconfie de comentários e documentação — verifique a veracidade de cada afirmação.
2. **Tudo o que exigir conhecimento da API** deve ser consultado no projeto da API (`atelie`). Não adivinhe contratos, comportamentos ou campos.
3. **Cada arquivo relevante deve ser lido** antes de se tirar conclusões. Não confie em sumários ou visões parciais.
4. **Toda falha encontrada deve ser detalhada** com: o que é, onde está, por que é um problema, qual o risco, como corrigir.

## Procedimento

Siga cada fase em ordem. Não pule fases. Documente descobertas num arquivo de relatório.

---

### Fase 1: Contratos de API (validação crítica)

1. Identifique todos os endpoints consumidos em `src/services/` e `src/lib/server-prefetch.ts`.
2. Para cada endpoint, consulte a API real (projeto `atelie`) e verifique:
   - URL e método HTTP
   - Parâmetros de query esperados (`page`, `perPage`, `search`, `sort`, `direction`, etc.)
   - Estrutura de resposta (formato `data`, `message`, envelope de paginação)
   - Schemas zod em `src/lib/responseSchemas.ts` — cada campo bate com a API?
   - Tratamento de erros (Problem JSON, campos de validação, status HTTP)
3. Liste divergências entre o que o front supõe e o que a API realmente retorna.

### Fase 2: Segurança

1. **CSP (Content Security Policy)**
   - Leia `src/proxy.ts` — a CSP é gerada corretamente?
   - Em produção: `'strict-dynamic'` com nonce?
   - Em dev: modo relaxado para HMR?
   - Os `connect-src` e `img-src` incluem as origens corretas?
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

### Fase 7: Documentação

1. **Veracidade**
   - Leia `docs/CONVENTIONS.md`, `docs/LLM-REFERENCE.md`, `CLAUDE.md`, `AGENTS.md`, `README.md`, `docs/DEPLOYMENT.md`
   - Para cada afirmação sobre código, verifique no código real se é verdade.
   - Liste discrepâncias entre documentação e implementação.
2. **Import paths**
   - Os import paths em `docs/LLM-REFERENCE.md` estão corretos?
   - Novos services/hooks foram criados mas não documentados?
3. **Completude**
   - Toda funcionalidade implementada está documentada?
   - Faltam instruções para o que o projeto faz?

---

## Relatório de auditoria

Ao final, produza um relatório em markdown com:

```markdown
# Relatório de Auditoria — serv_front

## Resumo
- **Total de falhas**: N
- **Críticas**: N | **Altas**: N | **Médias**: N | **Baixas**: N

## Falhas encontradas

### F-[ID] — [Título] (CRÍTICA/ALTA/MÉDIA/BAIXA)
- **Onde**: arquivo, linha
- **Problema**: descrição clara
- **Risco**: impacto potencial
- **Correção**: passo a passo ou sugestão de código
- **Prioridade**: (recomendado) / opcional
```

Cada falha deve ser acionável — um desenvolvedor deve conseguir ler e corrigir sem ambiguidade.

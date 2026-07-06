<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:project-rules -->

# Project rules — serv_front

## Critical

- **Sempre leia `docs/CONVENTIONS.md`** antes de codificar. Contém os padrões arquiteturais.
- **Sempre leia `docs/LLM-REFERENCE.md`** para consultar import paths e trechos exatos.
- **Sempre leia o arquivo que vai editar** antes de modificá-lo. Nunca suponha conteúdo.
- **Nunca use `any`** — tipagem estrita obrigatória. Sem exceções.
- **Nunca desabilite regras de ESLint** — sem `eslint-disable`, sem `eslint-enable`, sem `eslint-disable-next-line`.
- **Sem comentários inline** no código. Nomes descritivos de variáveis/funções substituem comentários.
- **Todo commit deve passar pelo quality gate completo** (`lint && typecheck && test && build && format:check`). Nunca usar `--no-verify`, `--no-verification` ou qualquer bypass.
- **Commits sem co-autoria**: commits não devem incluir `Co-authored-by` de LLMs ou co-autores não humanos. Apenas contribuidores reais.
- **Mensagens de commit limpas**: a mensagem do commit deve conter apenas a linha de assunto (e corpo opcional se necessário). Sem comentários adicionais, linhas de co-autoria automática ou assinaturas geradas por ferramentas.
- **Segurança, performance, adequação à LGPD, qualidade de código e bom funcionamento das ferramentas** são prioridade máxima, sobressaindo-se à velocidade de execução.
- **A estrutura de código atual deve ser preservada**: diretórios com `_` dentro de features em `app/` (`_hooks/`, `_components/`, `_schemas/`, `_assets/`), services em `src/services/`, interfaces em `src/interfaces/`, etc.
- **Consulte a API** para informações necessárias — nunca suponha ou adivinhe contratos, campos ou comportamentos.
- **Nomes em inglês** descritivos para variáveis, classes, funções, componentes e arquivos.
- **UI responsiva**: tudo deve funcionar perfeitamente em desktop e mobile.
- **UI em pt-BR** por padrão, adaptando-se ao idioma selecionado. Incluindo feedback, toasts e mensagens de erro.

## Stack

- Next.js 16 + React 19 + Tailwind CSS v4 + shadcn/ui
- TanStack Query v5 (server state)
- react-hook-form + zod v4 (forms)
- next-intl (i18n) + next-themes (tema) + sonner (toasts)
- Vitest (unit) + Playwright (e2e)

## Arquitetura

```
services (HTTP) → interfaces (contratos) → hooks (TanStack Query) → components/pages (UI)
```

- Components **nunca** chamam `fetch` direto. Sempre via services → apiClient.
- Validação zod nas duas pontas: formulário (entrada) e resposta da API (saída).
- Pastas privadas de feature têm prefixo `_` (`_hooks/`, `_components/`, `_schemas/`).

## Integração com a API

- A integação com a API deve ser **perfeita** — o front adapta-se à API, não o contrário.
- Se for **absolutamente necessária** alguma alteração na API, ela deve ser **requisitada** (nunca assumida).

## Design & UX

- **Tema**: a UI é voltada a um **ateliê de cerâmica** — deve transmitir essa identidade: cores terrosas, suaves; bordas arredondadas; tipografia limpa; sensação artesanal e minimalista.
- **shadcn/ui** é a base dos componentes, com customizações temáticas permitidas.
- **Campos pouco intuitivos** devem ter um texto de ajuda (`description`) explicando o propósito/uso — sem exageros.
- **Tabelas** devem ter, conforme necessidade: paginação (integrada à API), campo de busca textual (multi-campos), filtros e ordenação por colunas onde fizer sentido.
  - A paginação é **server-side** (via API) — o front envia `page`, `per_page`, `search`, `sort`, `direction`.
  - Use `useListController` para gerenciar página + busca com debounce + ordenação.

## Qualidade (obrigatório antes de concluir)

```bash
npm run lint && npm run typecheck && npm run test && npm run build && npm run format:check
```

Tudo deve passar sem erros nem warnings.

<!-- END:project-rules -->

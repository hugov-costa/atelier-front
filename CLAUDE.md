# Instruções para LLMs

Leia `@AGENTS.md` e `docs/LLM-REFERENCE.md` neste diretório antes de escrever código.

## Regras obrigatórias

1. **Leia primeiro**: sempre leia `docs/CONVENTIONS.md` e `docs/LLM-REFERENCE.md` antes de criar ou editar arquivos. Eles contêm os padrões exatos do projeto.
2. **Import paths**: use o atalho `@/` (ex.: `@/lib/api-client`, `@/components/form/form`).
3. **Form kit**: NÃO use `react-hook-form` diretamente — use `<Form>`, `<FormInput>`, `<FormSelect>`, `<FormSwitch>` de `@/components/form/`.
4. **DataTable**: NÃO crie tabelas manuais — use `<DataTable>` de `@/components/data-table/data-table` com colunas tipadas.
5. **Services**: toda chamada HTTP passa por `src/services/` → `apiClient`. NUNCA use `fetch` direto em componentes.
6. **Response schemas**: valide respostas da API com `parseApiResponse(schema, response)` de `@/lib/responseSchemas`.
7. **Query keys**: registre em `src/lib/queryKeys.ts`.
8. **i18n**: strings novas em `pt-BR` e `en`. Zod schemas como factory `createXSchema(t)`.
9. **Permissões**: use `<Can>` ou `<RequirePermission>` com `useAuthorization().can(...)`. Gate de dados com `enabled: can(...)`.
10. **Tipagem**: estrita, sem `any`, sem `eslint-disable`.
11. **Formatação**: `npm run format` ao final.
12. **Qualidade**: `npm run lint && npm run typecheck && npm run test && npm run build` devem passar. Nunca use `--no-verify` ou bypass.
13. **Commits sem co-autoria**: commits não devem incluir `Co-authored-by` de LLMs ou co-autores não humanos. Apenas contribuidores reais.
14. **Mensagens de commit limpas**: a mensagem do commit deve conter apenas a linha de assunto (e corpo opcional se necessário). Sem comentários adicionais, linhas de co-autoria automática ou assinaturas geradas por ferramentas.
15. **Sem comentários inline**: nomes descritivos eliminam a necessidade de comentários.
16. **Sem `eslint-disable`**: nenhuma regra de ESLint pode ser desabilitada.
17. **Segurança, performance, LGPD, qualidade e ferramentas** são prioridade máxima, acima da velocidade.
18. **API first**: o front adapta-se à API. Alterações na API devem ser requisitadas.
19. **Estrutura existente**: preserve diretórios `_` dentro de features, services, interfaces, etc.
20. **Consulte a API**: nunca adivinhe contratos, campos ou comportamentos — consulte a API real.
21. **Nomes em inglês**: variáveis, funções, componentes, arquivos — todos descritivos e em inglês.
22. **UI pt-BR**: textos da interface em português, adaptando conforme o idioma selecionado. Toasts e feedback também.
23. **Responsivo**: tudo deve funcionar perfeitamente em desktop e mobile.
24. **shadcn/ui**: use os componentes do shadcn como base; customizações temáticas são permitidas.
25. **Design de cerâmica**: a UI deve refletir um ateliê de cerâmica — cores terrosas, minimalista, delicada.
26. **Tabelas**: paginação (server-side via API), busca textual multi-campos, filtros e ordenação.
27. **Organização de código**: campos DB na ordem `id` → `ulid` → FKs (alpha) → demais (alpha) → `created_at` → `deleted_at` → `updated_at`. Itens de array/objeto, componentes e parâmetros em ordem alfabética. Funções: públicas (alpha) primeiro, privadas (alpha) depois.

## Quick reference

| O que fazer         | Import path                                                |
| ------------------- | ---------------------------------------------------------- |
| Cliente HTTP        | `@/lib/api-client`                                         |
| Form kit            | `@/components/form/form` + `@/components/form/form-fields` |
| DataTable           | `@/components/data-table/data-table`                       |
| Paginação           | `@/components/data-table/pagination-controls`              |
| Autorização         | `@/hooks/useAuthorization`                                 |
| Query keys          | `@/lib/queryKeys`                                          |
| Schemas zod         | `@/lib/responseSchemas`                                    |
| Erro HTTP           | `@/utils/httpError`                                        |
| Toast               | `sonner` + `@/utils/resolveHttpErrorMessage`               |
| Erro validação form | `@/utils/handleFormValidationError`                        |
| Formatação datas    | `@/utils/formatters`                                       |
| Contexto do usuário | `@/contexts/user-context`                                  |
| Env                 | `@/lib/env`                                                |

## Comportamento

- Ao oferecer opções para uma ação, use uma caixa de múltipla escolha (com ou sem seleção múltipla conforme o caso) e marque a opção recomendada com o sufixo **(recomendado)**.

---
name: review-audit
description: "Analisar e contrapor um relatório de auditoria de código fornecido pelo usuário. Usar quando solicitar: revisar auditoria, contrapor, analisar relatório, verificar achados, confirmar auditoria, avaliar relatório de auditoria, cruzar achados."
argument-hint: "Cole o relatório de auditoria ou descreva os achados a serem verificados"
---

# Revisão de Auditoria (Contra-Análise) — serv_front

Analisar um relatório de auditoria **fornecido pelo usuário**, cruzando cada achado com o código real do projeto.

> ⚠️ **Diferença da skill `audit`**: esta skill **não** faz varredura do zero. Ela pega um relatório pronto (de outra ferramenta, outro agente, ou sessão anterior) e verifica cada alegação contra o código.

---

## Procedimento

### 1. Carregar Contexto

1. Leia as instruções do projeto (`CLAUDE.md` e `AGENTS.md` na raiz)
2. Leia as convenções de código (`docs/CONVENTIONS.md`) e a referência técnica (`docs/LLM-REFERENCE.md`)
3. Consulte a memória do repositório (`/memories/repo/boilerplate-front.md`) para decisões de design já tomadas e correções pendentes
4. Se o usuário passou um documento/texto, identifique claramente cada **achado** individual

### 2. Para Cada Achado

Para cada ponto do relatório, execute:

1. **Localizar o código**: encontre o arquivo e linha exatos mencionados (ou deduza pelo contexto)
2. **Ler o código real**: leia o trecho completo, não apenas a linha citada. Nada de "...existing code..."
3. **Verificar a alegação**: o que o relatório diz é verdade? O código realmente faz o que foi afirmado?
4. **Classificar**:

| Veredito                                | Significado                                                                    |
| --------------------------------------- | ------------------------------------------------------------------------------ |
| ✅ **Confirmado**                       | A evidência no código bate com o achado. Severidade está calibrada.            |
| ⚠️ **Confirmado, severidade incorreta** | O problema existe, mas a severidade atribuída está errada (sub/superestimada). |
| ❌ **Falso-positivo**                   | O relatório alega algo que o código não confirma. Explique por quê.            |
| 🔶 **Depende de decisão**               | O achado é real, mas a correção depende de uma decisão de projeto que é sua.   |
| ❓ **Não verificável**                  | O código citado não está no escopo ou não foi encontrado.                      |

### 3. Sugerir Correções

Para cada achado **confirmado**, sugira:

```
### H1 — [Título]
**Veredito**: ✅ Confirmado [ou ⚠️ Confirmado, severidade incorreta]
**Correção proposta**: [descrição clara do que precisa mudar]
**Arquivos envolvidos**: [lista de arquivos]
**Depende de decisão?**: [sim/não — se sim, qual pergunta]
```

### 4. Capturar Decisões Pendentes

Quando um achado depender de decisão de projeto (ex.: "qual mensagem de erro exibir?", "deve ter fallback de idioma?", "qual o tempo de stale ideal?"), **pergunte usando o formato de opções selecionáveis** (`vscode_askQuestions`).

Registre a decisão na memória do repositório em `/memories/repo/boilerplate-front.md`.

### 5. Validar Pontuação (Scoring)

Se o relatório de auditoria original incluir um **sistema de pontuação (0–100)**, verifique:

1. **As deduções estão calibradas?** Cada falha tem uma dedução de pontos condizente com sua severidade?
   - CRÍTICA: −15 a −25
   - ALTA: −8 a −12
   - MÉDIA: −3 a −6
   - BAIXA: −1 a −2
   - INFORMATIVO: 0
2. **A contagem está correta?** Some as deduções de cada seção e recalcule a pontuação.
3. **O cálculo da pontuação geral está correto?** Use a média ponderada:
   `geral = (segurança×3 + api×2 + lgpd×2 + qualidade×2 + perf×1 + ferram×1 + docs×1) / 12`
4. Se a pontuação estiver incorreta, recalcule e aponte o erro no relatório.

### 6. Relatório Final

Ao final, produza um resumo no formato:

```markdown
## Resumo da Contra-Análise

| Veredito                              | Quantidade |
| ------------------------------------- | ---------- |
| ✅ Confirmados                        | N          |
| ⚠️ Confirmados (severidade incorreta) | N          |
| ❌ Falso-positivos                    | N          |
| 🔶 Dependentes de decisão             | N          |
| ❓ Não verificáveis                   | N          |

### Validação de Pontuação

| Seção               | Pontuação informada | Pontuação recalculada | Correção necessária? |
| ------------------- | ------------------- | --------------------- | -------------------- |
| Segurança           | XX/100              | XX/100                | Sim/Não              |
| Contratos de API    | XX/100              | XX/100                | Sim/Não              |
| LGPD                | XX/100              | XX/100                | Sim/Não              |
| Qualidade de código | XX/100              | XX/100                | Sim/Não              |
| Performance         | XX/100              | XX/100                | Sim/Não              |
| Ferramentas         | XX/100              | XX/100                | Sim/Não              |
| Documentação        | XX/100              | XX/100                | Sim/Não              |
| **Geral**           | XX/100              | XX/100                | Sim/Não              |

## Pendências

- [Decisão 1] — [pergunta]
- [Decisão 2] — [pergunta]

## Próximos Passos

[Sugestão de ordem de correção, considerando as decisões pendentes]
```

---

## Regras

- **Não confie no relatório cegamente** — verifique cada alegação contra o código real
- **Seja honesto** — se o achado procede, confirme. Se não, explique
- **Separe fato de opinião** — "código não faz X" é fato. "Devia fazer Y" é opinião
- **Anotações duvidosas** — se o relatório apontar divergência entre documentação e código, verifique e classifique conforme a skill `audit` (prescritivo vs assertivo)
- **Atualize a memória** — salve decisões tomadas e alinhe com correções já pendentes
- **Contratos de API**: ao questionar contratos de API, consulte o projeto da API (`atelier`) para confirmar — nunca suponha
- **Documentos de deploy**: ao revisar achados sobre deploy, variáveis de ambiente, topologia, CORS ou CSRF, leia **todos** os documentos de deploy (`docs/DEPLOYMENT.md`, `docs/DEPLOY-RENDER.md` do front e `../boilerplate-api/docs/DEPLOYMENT.md`, `../boilerplate-api/docs/DEPLOY-RENDER.md` da API) e verifique consistência entre eles
- **UI/UX**: ao apontar problemas de UI, verifique tanto o componente quanto o design system (shadcn/ui) e as regras de tema do projeto
- **Teste com os containers em execução**: se o achado envolver comportamento em runtime (ex.: falha de CSP, rota que não redireciona, header HTTP ausente, fluxo de login quebrado, build falhando), **suba os containers** com `docker compose up -d` (a partir da raiz do front — o `docker-compose.yml` já inclui o backend, que será upado junto) e verifique o comportamento real. A contra-análise baseada apenas em leitura de código pode perder problemas que só se manifestam em execução.
- **Testes e ferramentas rodam dentro do container Docker**: o projeto não tem Node.js instalado no ambiente host. Comandos como `npm run test`, `npm run lint`, `npm run build` etc. só funcionam **dentro do container**. Use:
  ```bash
  docker compose run --rm web npm run <comando>
  ```
  Nunca tente rodar `npm` diretamente no host.

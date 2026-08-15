# DIRECTIVA DE ENGENHARIA MANDATÓRIA PARA AGENTES DE IA

> **ATENÇÃO AGENTE:** Este projeto possui um ciclo de desenvolvimento assistido por IA estrito, padronizado e auditado. É **PROIBIDO** escrever ou modificar código sem seguir o protocolo oficial.

---

## ⚡ PROTOCOLO OBRIGATÓRIO: Ciclo de Desenvolvimento com IA

Para **TODA E QUALQUER TAREFA** de desenvolvimento (criação de módulos, modificação de funcionalidades, refatoração, endpoints, persistência ou correções), você **DEVE OBRIGATORIAMENTE** seguir o ciclo documentado em:

👉 **[`docs/ai/ai-development-guide.md`](file:///c:/Users/MP/Documents/app-invoice-sas/boilerPlate/docs/ai/ai-development-guide.md)**

```text
               REQUISITO DO USUÁRIO
                        │
                        ▼
         1. CONSULTAR docs/modules/module-registry.md
                        │
                        ▼
         2. IDENTIFICAR MÓDULO ALVO & LER docs/modules/<module>.md
                        │
                        ▼
         3. VERIFICAR package.json / VERSÕES INSTALADAS
                        │
                        ▼
         4. CONSULTAR DOCUMENTAÇÃO OFICIAL DAS LIBS (NUNCA INVENTAR APIs)
                        │
                        ▼
         5. SEGUIR O GOLDEN MODULE (docs/architecture/golden-module.md)
                        │
                        ▼
         6. APRESENTAR PLANO TÉCNICO & OBTER APROVAÇÃO
                        │
                        ▼
         7. IMPLEMENTAR (Clean Architecture + DDD)
                        │
                        ▼
         8. EXECUTAR TESTES (Unitários com Sinon / Integração)
                        │
                        ▼
         9. ATUALIZAR DOCUMENTAÇÃO (docs/modules/<module>.md)
                        │
                        ▼
        10. ATUALIZAR STATUS NO MODULE REGISTRY (docs/modules/module-registry.md)
```

---

## 🛑 AS 20 LEIS MANDATÓRIAS DA IA (Resumo)

Consulte o documento completo em: **[`docs/ai/ai-rules.md`](file:///c:/Users/MP/Documents/app-invoice-sas/boilerPlate/docs/ai/ai-rules.md)**

1. **Consultar o Module Registry primeiro** (`docs/modules/module-registry.md`).
2. **Não reler todos os módulos** sem necessidade (economizar contexto).
3. **Usar o Golden Module como gabarito** (`docs/architecture/golden-module.md`).
4. **Consultar a documentação do módulo específico** antes de tocar no código.
5. **Verificar `package.json`** e versões instaladas.
6. **Consultar a documentação oficial da versão** instalada (AdonisJS v6, VineJS v2, Japa v3).
7. **NUNCA inventar APIs, métodos, imports ou decorators**.
8. **Respeitar os limites da Clean Architecture:** Domínio não importa Framework nem Banco.
9. **Retornos de casos de uso com `Either<Left, Right>`** e erros com `Result<DomainError>`.
10. **Persistência desacoplada:** Models Lucid + Mappers + Portas de Repositório em `ports/`.
11. **Transações com `TransactionAdapter`**.
12. **Rotas com `routeAdapter`** e metadados Sentry (`operation`, `description`).
13. **Validação de payload com VineJS**.
14. **Autorização obrigatória com `middleware.can(...)`**.
15. **Testes unitários obrigatórios com Sinon stubs** em cada caso de uso (`*.spec.ts`).
16. **Proibido acoplamento direto entre módulos** (usar Outbox/Inbox ou eventos).
17. **Proibido hardcoded strings** (usar `i18n.formatMessage`).
18. **Seguir convenções de nomenclatura** (`docs/standards/naming-conventions.md`).
19. **Apresentar plano antes de implementar**.
20. **Atualizar a documentação e o Module Registry ao concluir**.

---

## 📚 Mapa Rápido da Documentação Central

- 🗺️ **Inventário Vivo dos Módulos:** [`docs/modules/module-registry.md`](file:///c:/Users/MP/Documents/app-invoice-sas/boilerPlate/docs/modules/module-registry.md)
- 🏗️ **Visão Geral da Arquitetura:** [`docs/architecture/overview.md`](file:///c:/Users/MP/Documents/app-invoice-sas/boilerPlate/docs/architecture/overview.md)
- 🌟 **Módulo de Referência (Golden Module):** [`docs/architecture/golden-module.md`](file:///c:/Users/MP/Documents/app-invoice-sas/boilerPlate/docs/architecture/golden-module.md)
- 🚀 **Como Criar Novos Módulos:** [`docs/architecture/creating-modules.md`](file:///c:/Users/MP/Documents/app-invoice-sas/boilerPlate/docs/architecture/creating-modules.md)
- 🧪 **Guia de Testes Automatizados:** [`docs/testing/testing-guide.md`](file:///c:/Users/MP/Documents/app-invoice-sas/boilerPlate/docs/testing/testing-guide.md)
- 🔒 **Guia de Segurança e ACL:** [`docs/security/security-guide.md`](file:///c:/Users/MP/Documents/app-invoice-sas/boilerPlate/docs/security/security-guide.md)
- 🚫 **Anti-Padrões Proibidos:** [`docs/standards/anti-patterns.md`](file:///c:/Users/MP/Documents/app-invoice-sas/boilerPlate/docs/standards/anti-patterns.md)

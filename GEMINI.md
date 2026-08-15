# DIRECTIVA DE ENGENHARIA MANDATÓRIA PARA AGENTES DE IA

> **ATENÇÃO:** Este projeto possui um ciclo de desenvolvimento assistido por IA estrito, padronizado e auditado. É **PROIBIDO** escrever ou modificar código sem seguir o protocolo oficial.

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

## 📚 Documentos Centrais de Consulta

- 🗺️ **Inventário Vivo dos Módulos:** [`docs/modules/module-registry.md`](file:///c:/Users/MP/Documents/app-invoice-sas/boilerPlate/docs/modules/module-registry.md)
- 📋 **As 20 Leis da IA:** [`docs/ai/ai-rules.md`](file:///c:/Users/MP/Documents/app-invoice-sas/boilerPlate/docs/ai/ai-rules.md)
- 🏗️ **Visão Geral da Arquitetura:** [`docs/architecture/overview.md`](file:///c:/Users/MP/Documents/app-invoice-sas/boilerPlate/docs/architecture/overview.md)
- 🌟 **Módulo de Referência (Golden Module):** [`docs/architecture/golden-module.md`](file:///c:/Users/MP/Documents/app-invoice-sas/boilerPlate/docs/architecture/golden-module.md)
- 🚀 **Como Criar Novos Módulos:** [`docs/architecture/creating-modules.md`](file:///c:/Users/MP/Documents/app-invoice-sas/boilerPlate/docs/architecture/creating-modules.md)
- 🧪 **Guia de Testes Automatizados:** [`docs/testing/testing-guide.md`](file:///c:/Users/MP/Documents/app-invoice-sas/boilerPlate/docs/testing/testing-guide.md)
- 🔒 **Guia de Segurança e ACL:** [`docs/security/security-guide.md`](file:///c:/Users/MP/Documents/app-invoice-sas/boilerPlate/docs/security/security-guide.md)
- 🚫 **Anti-Padrões Proibidos:** [`docs/standards/anti-patterns.md`](file:///c:/Users/MP/Documents/app-invoice-sas/boilerPlate/docs/standards/anti-patterns.md)

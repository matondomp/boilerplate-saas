# Base de Engenharia & Documentação Central do Boilerplate

> **Versão do Boilerplate:** `0.1.2` | **Stack Base:** AdonisJS v6 (TypeScript), Vue 3, Inertia.js, Lucid ORM (MySQL), MongoDB, BullMQ (Redis)  
> **Status da Base de Conhecimento:** Sincronizada com o código fonte real em 2026.

---

## 📌 Propósito Desta Documentação

Esta pasta `docs/` é a **memória persistente e a central de engenharia** deste boilerplate. Ela foi construída com base numa análise exaustiva e orientada por evidências do código-fonte real.

O objetivo é:
1. Servir de **manual de integração e onboarding** para engenheiros humanos;
2. Servir de **guia operacional para agentes de Inteligência Artificial**, garantindo que nenhuma sessão de IA precise reler o projeto inteiro ou inventar padrões/APIs;
3. Manter a arquitetura, regras de negócio, convenções de código, segurança e testes rigorosamente consistentes e auto-documentados.

---

## 🗺️ Mapa de Navegação da Documentação

A estrutura documental está organizada da seguinte forma:

```text
docs/
├── README.md                           # Visão geral e índice mestre (este arquivo)
│
├── architecture/                       # Fundações arquiteturais e decisões de design
│   ├── overview.md                     # Visão global da arquitetura (Monólito Modular, DDD, Clean Arch)
│   ├── creating-modules.md             # Guia passo a passo para criação de novos módulos
│   ├── module-dependencies.md          # Regras e limites de acoplamento entre módulos
│   ├── golden-module.md                # O módulo de referência padrão (Roles Management & Auth)
│   ├── pattern-matrix.md               # Matriz de problemas x padrões reais x localização
│   └── dependency-map.md               # Mapa visual e textual de dependências e comunicação
│
├── modules/                            # Inventário vivo e documentação individual dos módulos
│   ├── module-registry.md              # [CRÍTICO] Registro vivo do status e metadados de todos os módulos
│   ├── shared.md                       # Módulo Core Shared (entidades base, outbox/inbox, infraestrutura comum)
│   ├── auth.md                         # Módulo de Autenticação (Sessão Web, Tokens API, Reset de Senha)
│   ├── admin-common.md                 # Módulo de Perfil, Notificações, Timezones e Dashboard Comum
│   ├── admin-audit-log.md              # Módulo de Auditoria e Logs em MongoDB
│   ├── admin-roles-management.md       # Módulo de Gestão de Perfis/Roles e Permissões (ACL)
│   ├── admin-users-management.md       # Módulo de Gestão de Usuários, Bloqueio e Impersonação
│   ├── admin-application-management.md # Módulo de Configurações da Aplicação e Personalização
│   ├── admin-dashboard-management.md   # Módulo de Dashboards Customizados e Itens Dinâmicos
│   └── addons-crm.md                   # Addon de CRM / Gestão de Clientes (Em desenvolvimento)
│
├── ai/                                 # Regras e fluxos de trabalho assistidos por IA
│   ├── ai-development-guide.md         # Ciclo de vida estrito de desenvolvimento para agentes de IA
│   └── ai-rules.md                     # As 20 regras obrigatórias para agentes de IA
│
├── api/                                # Padrões de desenvolvimento de APIs RESTful
│   └── api-development-guide.md        # Formatação de rotas, controllers, DTOs, respostas e erros
│
├── database/                           # Estratégia e padrões de persistência de dados
│   └── database-guide.md               # MySQL (Lucid), MongoDB, Migrations modulares, Seeders sincronizados
│
├── testing/                            # Estratégia de testes automatizados
│   └── testing-guide.md                # Japa 3, Testes Unitários com Sinon, Testes de Integração e E2E Playwright
│
├── security/                           # Diretrizes e auditoria de segurança
│   └── security-guide.md               # Autenticação, ACL/RBAC, Rate Limiting, Isolamento, Sanitização
│
├── standards/                          # Convenções de engenharia e qualidade
│   ├── naming-conventions.md           # Padrões de nomenclatura (arquivos, classes, tabelas, métodos)
│   ├── code-review.md                  # Checklist de revisão de código
│   └── anti-patterns.md                # Anti-padrões estritamente proibidos
│
└── templates/                          # Modelos padronizados para replicação
    └── module-template.md              # Template padrão para novos módulos e documentação
```

---

## ⚡ Regra de Ouro para Desenvolvedores e Agentes de IA

Sempre que iniciar uma nova tarefa ou implementar uma funcionalidade:

```text
1. CONSULTAR PRIMEIRO: docs/modules/module-registry.md
2. LER DOCUMENTAÇÃO ESPECÍFICA DO MÓDULO ALVO em docs/modules/<module>.md
3. VERIFICAR DEPENDÊNCIAS em package.json e CONSULTAR DOCUMENTAÇÃO OFICIAL DA VERSÃO INSTALADA
4. CRIAR / REVISAR PLANO TÉCNICO
5. IMPLEMENTAR SEGUINDO OS PADRÕES DO GOLDEN MODULE (docs/architecture/golden-module.md)
6. VALIDAR COM TESTES (Unitários, Integração)
7. ATUALIZAR A DOCUMENTAÇÃO E O MODULE REGISTRY
```

---

## 🏷️ Classificação de Evidência da Documentação

Nenhum dado nesta documentação é fictício. Todas as afirmações técnicas são categorizadas como:
- `[IMPLEMENTADO]`: Verificado e funcional no código fonte existente.
- `[PARCIALMENTE IMPLEMENTADO]`: Existe código estruturado, mas incompleto ou em evolução.
- `[NÃO IMPLEMENTADO]`: Módulo planejado ou arquitetura prevista ainda não codificada.
- `[RECOMENDADO]`: Boa prática arquitetural identificada na auditoria para evolução futura.

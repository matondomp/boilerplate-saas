# Guia de Desenvolvimento com IA (AI Development Guide)

> **Status:** `[NORMATIVO / OBRIGATÓRIO]`  
> **Público-Alvo:** Todos os Agentes de Inteligência Artificial e Engenheiros de Software que operam neste repositório.

---

## 1. O Fluxo de Trabalho Estrito da IA

Nenhum agente de IA deve escrever código diretamente a partir de um requisito sem antes cumprir o ciclo obrigatório de engenharia:

```text
               REQUISITO DO USUÁRIO
                        │
                        ▼
         CONSULTAR MODULE REGISTRY (docs/modules/module-registry.md)
                        │
                        ▼
               IDENTIFICAR MÓDULO ALVO
                        │
                        ▼
          CONSULTAR DOCUMENTAÇÃO ESPECÍFICA (docs/modules/<module>.md)
                        │
                        ▼
         IDENTIFICAR MÓDULOS RELACIONADOS & DEPENDÊNCIAS
                        │
                        ▼
      VERIFICAR VERSÕES EM package.json / LOCKFILE
                        │
                        ▼
    CONSULTAR DOCUMENTAÇÃO OFICIAL DA VERSÃO (NÃO INVENTAR APIs!)
                        │
                        ▼
           ANALISAR CÓDIGO EXISTENTE / GOLDEN MODULE
                        │
                        ▼
            APRESENTAR PLANO TÉCNICO AO USUÁRIO
                        │
                        ▼
                 OBTER APROVAÇÃO
                        │
                        ▼
                  IMPLEMENTAR CÓDIGO
                        │
                        ▼
            EXECUTAR TESTES (Unitários / Integração / Types)
                        │
                        ▼
             REVISAR PADRÕES & LINT
                        │
                        ▼
             ATUALIZAR DOCUMENTAÇÃO EM docs/
                        │
                        ▼
         ATUALIZAR STATUS NO MODULE REGISTRY
```

---

## 2. Passo a Passo Operacional para Agentes de IA

### Passo 1: Consulta Inicial ao Registry
- **Ação:** Abra [module-registry.md](file:///c:/Users/MP/Documents/app-invoice-sas/boilerPlate/docs/modules/module-registry.md).
- **Objetivo:** Descobrir se a funcionalidade pertence a um módulo existente (`IMPLEMENTED` ou `IN_PROGRESS`) ou se deve ser criado um novo módulo (`PLANNED`).
- **Economia de Contexto:** **NÃO leia todos os arquivos do projeto.** Carregue apenas a documentação do módulo identificado.

---

### Passo 2: Verificação de Dependências e Versões
- **Ação:** Verifique o `package.json` para inspecionar as versões reais instaladas.
- **Regra:** Nunca assuma assinaturas de métodos com base em versões antigas do AdonisJS v5 ou bibliotecas legadas. Este projeto utiliza:
  - AdonisJS v6 (`@adonisjs/core: ^6.8.0`)
  - VineJS (`@vinejs/vine: ^2.0.0`)
  - Japa 3 (`@japa/runner: ^3.1.4`)
  - Vue 3 (`vue: ^3.4.25`)
  - Inertia v1 (`@inertiajs/vue3: ^1.0.16`)

---

### Passo 3: Consulta Obrigatória da Documentação Oficial
- **Ação:** Use ferramentas de consulta oficial (Context7, documentação da versão, `.d.ts` em `node_modules` ou exemplos existentes no projeto).
- **Proibição:** É estritamente proibido inventar flags, decorators, métodos ou propriedades inexistentes na versão instalada.

---

### Passo 4: Elaboração do Plano Técnico
- **Ação:** Descreva os arquivos a criar/modificar em cada camada (`domain/`, `usecases/`, `framework/infra/`, `framework/main/`).
- **Validação:** Verifique se as dependências respeitam o [Module Dependencies Guide](file:///c:/Users/MP/Documents/app-invoice-sas/boilerPlate/docs/architecture/module-dependencies.md).

---

### Passo 5: Implementação Baseada no Golden Module
- **Ação:** Use [golden-module.md](file:///c:/Users/MP/Documents/app-invoice-sas/boilerPlate/docs/architecture/golden-module.md) como gabarito.
- **Domínio:** Entidades com `static create()` e `static hydrate()`, `Either<Errors, Success>`.
- **Casos de Uso:** Namespaces formais, portas em `ports/`, injeção explícita no construtor.
- **Persistência:** Models Lucid com prefixo de módulo na tabela, Mappers e Repositórios.
- **Rotas:** Protegidas com `routeAdapter` e metadados Sentry.

---

### Passo 6: Validação por Testes e TypeScript
- **Ação:**
  - Execute `npm run typecheck`
  - Execute `node ace test --suite=unit`
  - Execute `npm run lint`

---

### Passo 7: Sincronização da Memória Persistente
- **Ação:**
  - Atualize ou crie o arquivo `docs/modules/<module-name>.md`.
  - Atualize a linha correspondente no [module-registry.md](file:///c:/Users/MP/Documents/app-invoice-sas/boilerPlate/docs/modules/module-registry.md).
  - Atualize o [dependency-map.md](file:///c:/Users/MP/Documents/app-invoice-sas/boilerPlate/docs/architecture/dependency-map.md) se novas interações inter-módulos foram criadas.

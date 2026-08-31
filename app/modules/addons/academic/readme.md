# Addon Academic (`app/modules/addons/academic`)

Addon plugável responsável pela estrutura curricular, exames oficiais, banco de questões e metas de preparação de estudantes.

## Arquitetura Interna

- `domain/`: Entidades DDD, Value Objects, Erros de Domínio, Eventos de Domínio e Contratos de Casos de Uso.
- `usecases/`: Implementações dos casos de uso, portas de repositórios/serviços e testes unitários 100% isolados com Sinon (`*.spec.ts`).
- `framework/infra/db/`: Models Lucid, Mappers bidirecionais, Repositórios e Migrations MySQL.
- `framework/main/`: Validadores VineJS, Controllers HTTP, Factories de Injeção de Dependência, Dicionários i18n e Rotas HTTP.

## Documentação Completa

- Requisitos Oficiais: [`docs/modules/module-01-master-prompt.md`](file:///c:/Users/MP/Documents/app-invoice-sas/boilerPlate/docs/modules/module-01-master-prompt.md)
- Plano Técnico: [`docs/modules/module-01-implementation-plan.md`](file:///c:/Users/MP/Documents/app-invoice-sas/boilerPlate/docs/modules/module-01-implementation-plan.md)
- Especificação Canônica: [`docs/modules/addons-academic.md`](file:///c:/Users/MP/Documents/app-invoice-sas/boilerPlate/docs/modules/addons-academic.md)
- Inventário de Módulos: [`docs/modules/module-registry.md`](file:///c:/Users/MP/Documents/app-invoice-sas/boilerPlate/docs/modules/module-registry.md)

# Documentação do Módulo: [Nome do Módulo] (`[caminho/do/modulo]`)

> **Localização:** `app/modules/[addons/ ou admin/ ou outro]/[module_name]`  
> **Status:** `[PLANNED | IN_PROGRESS | NEEDS_REVIEW | IMPLEMENTED | DEPRECATED]`  
> **Data de Início:** AAAA-MM-DD  
> **Última Atualização:** AAAA-MM-DD  
> **Responsável / Autor:** [Nome / Agente de IA]

---

## 1. Visão Geral e Objetivo de Negócio

[Descreva sucintamente o objetivo do módulo, o problema que ele resolve e os usuários ou subsistemas que interagem com ele.]

---

## 2. Entidades de Domínio e Invariantes (`domain/`)

| Entidade / Value Object | Tipo | Propriedades Principais | Regras e Invariantes de Negócio |
| :--- | :---: | :--- | :--- |
| `[EntityName]Entity` | Entity | `id`, `prop1`, `prop2`, `userId` | Validação de formato, campos obrigatórios no `static create()` |
| `[ValueObjectName]` | VO | `value` | Imutabilidade e validação de domínio |

---

## 3. Casos de Uso e Portas Secundárias (`usecases/`)

| Caso de Uso | Entrada (`Input`) | Saída (`Output`) | Erros Possíveis (`Errors`) | Portas Requeridas (`ports/`) |
| :--- | :--- | :--- | :--- | :--- |
| `Create[Resource]UseCase` | `{ name, ... }` | `Either<Errors, { id }>` | `[ErrorName]Error` | `[Resource]Repository`, `TransactionAdapter` |
| `List[Resource]UseCase` | `SearchWithPagination` | `Either<Errors, Pagination>` | N/A | `List[Resource]Repository` |

---

## 4. Persistência de Dados (`framework/infra/db/`)

### Tabelas MySQL:
- **Tabela:** `[module_prefix]_[table_name]` (ex: `crm_clients`)
- **Campos Principais:** `id (varchar 36 PK)`, `name`, `user_id`, `created_at`, `updated_at`, `deleted_at`.
- **Model Lucid:** `[Resource]Model` em `framework/infra/db/models/`.
- **Mapper:** `[Resource]Mapper` implementando conversão bidirecional.

---

## 5. Rotas, Controladores e Autorização (`framework/main/`)

| Método | Rota HTTP | Controller / Factory | Permissão ACL (`middleware.can`) | Metadados Sentry (`operation`) |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/account/[module]/[resource]` | `makeList[Resource]ControllerFactory()` | `[module]-[resource]-view` | `[module]-list-[resource]` |
| `POST` | `/account/[module]/[resource]/create` | `makeCreate[Resource]ControllerFactory()` | `[module]-[resource]-create` | `[module]-create-[resource]` |

---

## 6. Mensageria Assíncrona (Outbox / Inbox)

- **Eventos Publicados no Outbox:**
  - `[Resource]CreatedEvent` ➔ routing key: `[module].[resource].created`
- **Eventos Consumidos no Inbox:**
  - `CoreBroadcastEnum.NOTIFY` ➔ Notifica o usuário responsável

---

## 7. Testes Automatizados

- [ ] Testes Unitários de Entidade (`domain/entities/*.spec.ts`)
- [ ] Testes Unitários de Casos de Uso (`usecases/*/*.spec.ts`)
- [ ] Testes Funcionais / Integração (`framework/test/integration/*.test.ts`)
- [ ] Testes End-to-End no Navegador (`framework/test/e2e/*.test.browser.ts`)

---

## 8. Checklist de Conclusão do Módulo

- [ ] Arquitetura e camadas respeitadas (Domain, UseCases, Framework)
- [ ] Entidades com `static create()` e `static hydrate()`
- [ ] Testes unitários com Sinon passando 100%
- [ ] Migrations e seeders testados via `node ace db:sync`
- [ ] Rotas protegidas com `middleware.can(...)` e `routeAdapter`
- [ ] Dicionários i18n (`pt.json`, `en.json`) criados
- [ ] `docs/modules/module-registry.md` atualizado para `IMPLEMENTED`

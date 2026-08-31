# Inventário Vivo dos Módulos (Module Registry)

> **Status:** `[OFICIAL / VIVO]`  
> **Última Auditoria Geral:** 15 de Agosto de 2026  
> **Regra Mandatória:** Este registro DEVE ser consultado antes de qualquer nova implementação e atualizado obrigatoriamente a cada alteração de estado em qualquer módulo.

---

## 1. Tabela Geral de Módulos do Sistema

| Módulo | Status Oficial | Localização | Objetivo Principal | Dependências | Dependentes | Documentação | Última Atualização |
| :--- | :---: | :--- | :--- | :--- | :--- | :---: | :---: |
| **Shared** | `IMPLEMENTED` | `app/modules/shared` | Modelos base, Outbox/Inbox, adaptadores globais | `@core`, MySQL, MongoDB, Redis | Todos | [shared.md](file:///c:/Users/MP/Documents/app-invoice-sas/boilerPlate/docs/modules/shared.md) | 2026-08-15 |
| **Auth** | `IMPLEMENTED` | `app/modules/auth` | Autenticação Web/API, tokens, reset de senha | `@core`, `shared`, Limiter, Mail | Frontend, API | [auth.md](file:///c:/Users/MP/Documents/app-invoice-sas/boilerPlate/docs/modules/auth.md) | 2026-08-15 |
| **Admin::Common** | `IMPLEMENTED` | `app/modules/admin/common` | Perfil de usuário, dashboard comum, notificações | `@core`, `shared` | UI Principal | [admin-common.md](file:///c:/Users/MP/Documents/app-invoice-sas/boilerPlate/docs/modules/admin-common.md) | 2026-08-15 |
| **Admin::AuditLog** | `IMPLEMENTED` | `app/modules/admin/audit/log` | Visualização e extração de logs de auditoria | `@core`, `shared`, MongoDB | Admin Shell | [admin-audit-log.md](file:///c:/Users/MP/Documents/app-invoice-sas/boilerPlate/docs/modules/admin-audit-log.md) | 2026-08-15 |
| **Admin::RolesManagement** | `IMPLEMENTED` | `app/modules/admin/settings/acl/roles_management` | [Golden Module] Gestão de perfis (Roles) e permissões | `@core`, `shared` | ACL / CanMiddleware | [admin-roles-management.md](file:///c:/Users/MP/Documents/app-invoice-sas/boilerPlate/docs/modules/admin-roles-management.md) | 2026-08-15 |
| **Admin::UsersManagement** | `IMPLEMENTED` | `app/modules/admin/settings/acl/users_management` | CRUD de usuários, bloqueio, impersonação | `@core`, `shared` | Admin Shell | [admin-users-management.md](file:///c:/Users/MP/Documents/app-invoice-sas/boilerPlate/docs/modules/admin-users-management.md) | 2026-08-15 |
| **Admin::ApplicationManagement** | `IMPLEMENTED` | `app/modules/admin/settings/application_management` | Configurações do sistema (nome, cores, logotipos) | `@core`, `shared` | UI Shell | [admin-application-management.md](file:///c:/Users/MP/Documents/app-invoice-sas/boilerPlate/docs/modules/admin-application-management.md) | 2026-08-15 |
| **Admin::DashboardManagement** | `IMPLEMENTED` | `app/modules/admin/settings/dashboard_management` | Construtor de dashboards e widgets customizados | `@core`, `shared` | Admin Dashboard | [admin-dashboard-management.md](file:///c:/Users/MP/Documents/app-invoice-sas/boilerPlate/docs/modules/admin-dashboard-management.md) | 2026-08-15 |
| **Addons::CRM** | `IN_PROGRESS` | `app/modules/addons/crm` | Gestão de Clientes, Entidades Cativantes e Bancos | `@core`, `shared` | UI de Vendas | [addons-crm.md](file:///c:/Users/MP/Documents/app-invoice-sas/boilerPlate/docs/modules/addons-crm.md) | 2026-08-15 |
| **Addons::Student** | `IMPLEMENTED` | `app/modules/addons/student` | Aluno, Perfil de Preparação e Objetivos de Preparação | `@core`, `shared`, `academic` | Alunos & Preparação | [addons-student.md](file:///c:/Users/MP/Documents/app-invoice-sas/boilerPlate/docs/modules/addons-student.md) | 2026-08-31 |
| **Addons::Academic** | `INTEGRATED` | `app/modules/addons/academic` | Estrutura Académica, Exames, Questões, Moderação IA e Metas de Estudo | `@core`, `shared`, MySQL, MongoDB | Estudante, Admin, IA | [addons-academic.md](file:///c:/Users/MP/Documents/app-invoice-sas/boilerPlate/docs/modules/addons-academic.md) | 2026-08-28 |
| **Addons::Accounting** | `PLANNED` | `app/modules/addons/accounting` | Módulo de contabilidade (referenciado em adonisrc.ts) | `@core`, `shared` | Financeiro | *Pendente* | 2026-08-15 |
| **Addons::Pedagogy** | `PLANNED` | `app/modules/addons/pedagogy` | Gestão de Pautas, Alunos e Notas (MED Angola) | `@core`, `shared` | Gestão Escolar | [documentation.html](file:///c:/Users/MP/Documents/app-invoice-sas/boilerPlate/documentation.html) | 2026-08-15 |

---

## 2. Detalhamento Individual dos Módulos

### 2.1. Módulo `Shared`
- **Status:** `IMPLEMENTED`
- **Localização:** `app/modules/shared`
- **Responsabilidade:** Provedor das entidades mestras (`CoreUserModel`, `CoreRoleModel`, `CorePermissionModel`, `CoreMenuModel`), tabelas de mensageria assíncrona (`core_outbox_messages`, `core_inbox_messages`), adaptadores de email e geração de documentos com Carbone.
- **Entidades de Domínio:** `UserEntity`, `RoleEntity`, `NotificationEntity`, `AddonEntity`.
- **Banco de Dados (MySQL):** 17 tabelas migradas (`core_users`, `core_roles`, `core_permissions`, `core_menus`, `core_outbox_messages`, etc.).
- **Banco de Dados (MongoDB):** `CoreUserActivities`, `CoreNotifications`.
- **Testes:** Testes de integração de infraestrutura.

---

### 2.2. Módulo `Auth`
- **Status:** `IMPLEMENTED`
- **Localização:** `app/modules/auth`
- **Responsabilidade:** Autenticação por sessão web (com RememberMe), autenticação por Token API (`accessTokens`), recuperação e redefinição de senhas com links temporizados.
- **Casos de Uso:** `AuthenticateUserUseCase`, `SendResetPasswordUseCase`, `ResetPasswordUseCase`.
- **Endpoints Web:** `/security/auth/login`, `/security/auth/logout`, `/security/auth/reset/password`, `/security/auth/reset/send-mail`.
- **Endpoints API:** `POST /api/security/auth/login`, `POST /api/security/auth/logout`, `GET /api/auth/me`.
- **Testes:** Unitários com Sinon (`authenticate_user_usecase_impl.spec.ts`, etc.).

---

### 2.3. Módulo `Admin::RolesManagement` [Golden Module]
- **Status:** `IMPLEMENTED`
- **Localização:** `app/modules/admin/settings/acl/roles_management`
- **Responsabilidade:** Criação, edição, listagem com paginação e busca, exclusão individual e em lote de Roles e sincronização de permissões associadas.
- **Casos de Uso:** `CreateRoleUseCase`, `UpdateRoleUseCase`, `DeleteRoleUseCase`, `DeleteBulkRolesUseCase`, `FindRoleUseCase`, `ListRolesUseCase`, `ListRolesDropdownUseCase`, `FindPermissionsUseCase`.
- **Endpoints:** `/account/admin/settings/acl/roles/*`, `GET /api/admin/settings/acl/roles/dropdown`.
- **Testes:** 100% de cobertura unitária nos casos de uso (`*.spec.ts`).

---

### 2.4. Módulo `Admin::UsersManagement`
- **Status:** `IMPLEMENTED`
- **Localização:** `app/modules/admin/settings/acl/users_management`
- **Responsabilidade:** Gestão completa de contas de usuário, criação com geração segura de senha, alteração de permissões/roles, bloqueio/desbloqueio temporário e impersonação de sessão.
- **Casos de Uso:** `CreateUserUseCase`, `UpdateUserUseCase`, `DeleteUserUseCase`, `BlockUserUseCase`, `UnblockUserUseCase`, `FindUserUseCase`, `ListUsersUseCase`, `RedefinePasswordUseCase`, `ImpersonateUserUseCase`.
- **Testes:** Testes unitários com Sinon e testes de browser Playwright (`create_user_browser.ts`).

---

### 2.5. Módulo `Admin::AuditLog`
- **Status:** `IMPLEMENTED`
- **Localização:** `app/modules/admin/audit/log`
- **Responsabilidade:** Consulta e exportação de logs e atividades operacionais de usuários gravados no MongoDB.
- **Casos de Uso:** `ViewLogsUseCase`, `ExtractLogsUseCase`.
- **Testes:** Testes de entidade (`log_entity.spec.ts`), integração e testes E2E com browser.

---

### 2.6. Módulo `Admin::ApplicationManagement`
- **Status:** `IMPLEMENTED`
- **Localização:** `app/modules/admin/settings/application_management`
- **Responsabilidade:** Parametrização dinâmica da aplicação (Nome da empresa, logotipo, favicon, esquema de cores primárias/secundárias).
- **Casos de Uso:** `FindAppSettingUseCase`, `PersistAppSettingUseCase`.
- **Testes:** Testes de entidade (`application_settings_entity.spec.ts`), value objects (`color.spec.ts`) e usecases.

---

### 2.7. Módulo `Admin::DashboardManagement`
- **Status:** `IMPLEMENTED`
- **Localização:** `app/modules/admin/settings/dashboard_management`
- **Responsabilidade:** Construtor dinâmico de painéis de métricas e gráficos personalizados com associação por permissão/role.
- **Casos de Uso:** 16 use cases implementados (CRUD de dashboards e itens/widgets, ordenação, queries personalizadas).
- **Testes:** Testes unitários, testes de integração e testes E2E de navegador.

---

### 2.8. Módulo `Admin::Common`
- **Status:** `IMPLEMENTED`
- **Localização:** `app/modules/admin/common`
- **Responsabilidade:** Funcionalidades transversais para usuários autenticados (edição de dados do próprio perfil, alteração de senha pessoal, preferências de idioma e timezone, central de notificações e feed de atividades recentes).
- **Casos de Uso:** `UpdateUserInfoUseCase`, `UpdatePasswordUseCase`, `RetrieveTimezonesUseCase`, `FindNotificationsUseCase`, `RetrieveNewestActivitiesUseCase`, `RetrieveNewestNotificationsUseCase`.
- **Testes:** Testes unitários (`*.spec.ts`) e testes de browser.

---

### 2.9. Módulo `Addons::CRM`
- **Status:** `IN_PROGRESS`
- **Localização:** `app/modules/addons/crm`
- **Responsabilidade:** Gestão comercial de clientes, entidades cativantes, contas bancárias e moradas.
- **Estado Atual da Implementação:**
  - `[x]` Migração de banco de dados (`crm_clients`) criada.
  - `[x]` Model `ClientModel` e schemas básicos.
  - `[x]` Estrutura de domínio inicial (`customer`, `Residence`, `bank`).
  - `[!]` Casos de uso e portas de repositório incompletos.
  - `[!]` Nomenclatura interna requer padronização (`Residence` com R maiúsculo, `use-cases` com hífen em vez de `usecases`).
  - `[ ]` Testes unitários e de integração pendentes.
  - `[ ]` Rota única em `framework/main/routes.ts` com metadados reaproveitados incorretamente do AdminCommon.

---

### 2.10. Módulos Planejados (`PLANNED`)
- **`Addons::Accounting`:** Módulo financeiro e contábil referenciado em suites de testes de `adonisrc.ts` (`accounting-unit`, `accounting-functional`).
- **`Addons::Pedagogy`:** Módulo para o setor educacional de Angola (MED), detalhado no arquivo `documentation.html` com regras de notas (MAC, NPP, NPT, MT, MF), pautas e planos de aula.

---

### 2.11. Módulo `Addons::Academic`
- **Status:** `INTEGRATED`
- **Localização:** `app/modules/addons/academic`
- **Responsabilidade:** Estrutura Académica (Universidades, Unidades, Cursos, Disciplinas, Tópicos hierárquicos), Gestão e Provas de Exames de Acesso, Banco de Questões com alternativas/soluções/explicações didáticas, esteira de estados e moderação humana de IA, versionamento de revisões (`QuestionRevision`) e metas de preparação do estudante (`PreparationGoal`).
- **Estado da Implementação & Integração:**
  - `[x]` 11 Entidades de Domínio (`domain/entities/`) com invariantes e eventos.
  - `[x]` 8 Casos de uso implementados com Portas em `ports/` e testes unitários 100% isolados com Sinon (`*.spec.ts`).
  - `[x]` 11 Lucid Models com Soft Delete e relações completas (`framework/infra/db/models/`).
  - `[x]` 12 Migrations de banco de dados MySQL (`framework/infra/db/migrations/`).
  - `[x]` 4 Seeders (Permissões, Root ACL, Menus e Dados Ricos de Amostra) (`framework/infra/db/seeders/`).
  - `[x]` 8 Páginas Inertia.js com design system (`framework/views/`).
  - `[x]` Teste de Integração E2E ponta a ponta (`framework/tests/integration/academic_e2e_integration.test.ts`).
  - `[x]` Rotas HTTP protegidas com `middleware.auth()` e `middleware.can(...)`.
- **Documentação de Requisitos:** [module-01-master-prompt.md](file:///c:/Users/MP/Documents/app-invoice-sas/boilerPlate/docs/modules/module-01-master-prompt.md)
- **Plano Técnico de Integração E2E:** [module-01-e2e-master-prompt.md](file:///c:/Users/MP/Documents/app-invoice-sas/boilerPlate/docs/modules/module-01-e2e-master-prompt.md)
- **Documentação do Módulo:** [addons-academic.md](file:///c:/Users/MP/Documents/app-invoice-sas/boilerPlate/docs/modules/addons-academic.md)




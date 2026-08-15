# Módulo de Gestão de Perfis e Permissões (`admin/settings/acl/roles_management`)

> **Localização:** `app/modules/admin/settings/acl/roles_management`  
> **Status:** `IMPLEMENTED`  
> **Classificação Arquitetural:** [Golden Module](file:///c:/Users/MP/Documents/app-invoice-sas/boilerPlate/docs/architecture/golden-module.md)  
> **Última Atualização:** 15 de Agosto de 2026

---

## 1. Visão Geral e Responsabilidades

O módulo `roles_management` é o componente central do subsistema de controle de acesso baseado em papéis (RBAC / ACL). Ele permite que administradores criem papéis (Roles) personalizados, definam suas descrições e vinculem permissões granulares do sistema.

---

## 2. Casos de Uso Implementados

| Caso de Uso | Diretório | Descrição |
| :--- | :--- | :--- |
| `CreateRoleUseCase` | `usecases/create_role/` | Cria um novo papel e vincula permissões atomicamente via transação |
| `UpdateRoleUseCase` | `usecases/update_role/` | Atualiza nome, descrição e permissões de um papel existente |
| `DeleteRoleUseCase` | `usecases/delete_role/` | Remove um papel não-interno após validar usuários associados |
| `DeleteBulkRolesUseCase` | `usecases/delete_bulk_roles/` | Remove múltiplos papéis selecionados |
| `FindRoleUseCase` | `usecases/find_role/` | Recupera detalhes de um papel pelo seu ID ou slug |
| `ListRolesUseCase` | `usecases/list_roles/` | Lista papéis paginados com suporte a busca e filtros |
| `ListRolesDropdownUseCase`| `usecases/list_roles_dropdown/`| Retorna lista simplificada para selects/dropdowns na interface |
| `FindPermissionsUseCase` | `usecases/find_permissions/`| Retorna a matriz completa de permissões do sistema |

---

## 3. Endpoints e Autorização (ACL)

| Método | Rota | Permissão Requerida | Descrição |
| :--- | :--- | :--- | :--- |
| `GET` | `/account/admin/settings/acl/roles` | `admin-acl-view-roles` | Lista todos os perfis |
| `GET` | `/account/admin/settings/acl/roles/new` | `admin-acl-create-role` | Página de criação de perfil |
| `POST` | `/account/admin/settings/acl/roles/create` | `admin-acl-create-role` | Criação de novo perfil |
| `GET` | `/account/admin/settings/acl/roles/:slug/edit`| `admin-acl-modify-role`| Página de edição de perfil |
| `PUT` | `/account/admin/settings/acl/roles/edit` | `admin-acl-modify-role`| Salva alterações do perfil |
| `DELETE` | `/account/admin/settings/acl/roles/delete` | `admin-acl-delete-role`| Remove um perfil |
| `DELETE` | `/account/admin/settings/acl/roles/delete/bulk` | `admin-acl-delete-role`| Remove múltiplos perfis |
| `GET` | `/api/admin/settings/acl/roles/dropdown` | `admin-acl-view-roles` | Retorna lista JSON de roles |

---

## 4. Testes Automatizados

Possui 100% de cobertura unitária com testes em `@japa/runner` e `sinon` dentro de cada subpasta de usecase (`usecases/*/*.spec.ts`).

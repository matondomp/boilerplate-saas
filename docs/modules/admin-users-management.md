# Módulo de Gestão de Usuários (`admin/settings/acl/users_management`)

> **Localização:** `app/modules/admin/settings/acl/users_management`  
> **Status:** `IMPLEMENTED`  
> **Última Atualização:** 15 de Agosto de 2026

---

## 1. Visão Geral e Responsabilidades

O módulo `users_management` provê aos administradores o controle completo das contas de usuário:
- Criação de novos usuários com atribuição de Role e envio de credenciais.
- Edição de perfis de outros usuários.
- Bloqueio e desbloqueio temporário de contas.
- Redefinição administrativa de senhas.
- **Impersonação de Usuário:** Permite que um administrador navegue na plataforma com a identidade e privilégios de outro usuário para fins de suporte técnico e auditoria.

---

## 2. Casos de Uso

| Caso de Uso | Diretório | Descrição |
| :--- | :--- | :--- |
| `CreateUserUseCase` | `usecases/create_user/` | Cria usuário com validação de unicidade de email/username |
| `UpdateUserUseCase` | `usecases/update_user/` | Atualiza dados e role de um usuário |
| `DeleteUserUseCase` | `usecases/delete_user/` | Exclusão suave (soft-delete) de um usuário |
| `BlockUserUseCase` | `usecases/block_user/` | Bloqueia o acesso do usuário à plataforma |
| `UnblockUserUseCase` | `usecases/unblock_user/` | Reativa o acesso do usuário bloqueado |
| `FindUserUseCase` | `usecases/find_user/` | Localiza dados detalhados do usuário por ID |
| `ListUsersUseCase` | `usecases/list_users/` | Listagem paginada com busca e filtros |
| `RedefinePasswordUseCase`| `usecases/redefine_password/`| Altera administrativamente a senha do usuário |
| `ImpersonateUserUseCase` | `usecases/impersonate_user/`| Autentica a sessão no contexto do usuário alvo |

---

## 3. Endpoints e Autorização

- `GET /account/admin/settings/acl/users` ➔ `admin-acl-view-users`
- `GET /account/admin/settings/acl/users/new` ➔ `admin-acl-create-user`
- `POST /account/admin/settings/acl/users/create` ➔ `admin-acl-create-user`
- `GET /account/admin/settings/acl/users/:id/edit` ➔ `admin-acl-modify-user`
- `PUT /account/admin/settings/acl/users/edit` ➔ `admin-acl-modify-user`
- `POST /account/admin/settings/acl/users/:id/block` ➔ `admin-acl-block-user`
- `POST /account/admin/settings/acl/users/:id/unblock` ➔ `admin-acl-unblock-user`
- `POST /account/admin/settings/acl/users/:id/impersonate` ➔ `admin-acl-impersonate-user`

---

## 4. Testes

- Testes unitários com Sinon para todos os use cases (`*.spec.ts`).
- Testes E2E de navegador com Playwright em `framework/main/test/create_user_browser.ts`.

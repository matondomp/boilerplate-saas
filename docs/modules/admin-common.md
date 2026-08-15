# Módulo Administrativo Comum (`admin/common`)

> **Localização:** `app/modules/admin/common`  
> **Status:** `IMPLEMENTED`  
> **Última Atualização:** 15 de Agosto de 2026

---

## 1. Visão Geral e Responsabilidades

O módulo `admin/common` fornece as funcionalidades básicas do painel administrativo para qualquer usuário autenticado:
- Gestão do próprio perfil (atualização de nome, email, telefone, avatar, timezone e idioma de preferência).
- Alteração segura da própria senha de acesso.
- Consulta das notificações do usuário e marcação como lidas.
- Consulta do feed de atividades recentes do usuário.
- Renderização do dashboard principal e listagem de fusos horários suportados.

---

## 2. Casos de Uso

| Caso de Uso | Diretório | Descrição |
| :--- | :--- | :--- |
| `UpdateUserInfoUseCase` | `usecases/update_user_info/` | Atualiza dados cadastrais e preferências de idioma/timezone do usuário |
| `UpdatePasswordUseCase` | `usecases/update_password/` | Valida senha antiga e define nova senha com hash seguro Scrypt |
| `RetrieveTimezonesUseCase` | `usecases/retrieve_timezones/` | Retorna a lista de fusos horários mundiais válidos |
| `FindNotificationsUseCase` | `usecases/find_notifications/` | Recupera as notificações paginadas do usuário |
| `UpdateUserNotificationsUseCase` | `usecases/update_user_notifications/`| Marca notificações como lidas |
| `RetrieveNewestActivitiesUseCase`| `usecases/retrieve_newest_activities/`| Consulta atividades recentes do usuário no MongoDB |
| `RetrieveNewestNotificationsUseCase`| `usecases/retrieve_newest_notifications/`| Consulta notificações recentes não lidas |
| `RetrieveDashboardsUseCase` | `usecases/retrieve_dashboards/` | Consulta dashboards acessíveis ao usuário |
| `RetrieveDashboardItemsUseCase` | `usecases/retrieve_dashboard_items/`| Consulta widgets do dashboard ativo |

---

## 3. Endpoints Principais

- `GET /account/admin/common/dashboard` ➔ Painel inicial administrativo
- `GET /account/admin/common/profile` ➔ Página de visualização e edição do perfil
- `PUT /account/admin/common/profile` ➔ Salva alterações cadastrais do perfil
- `PUT /account/admin/common/profile/password` ➔ Altera a senha do usuário logado
- `GET /account/admin/common/notifications` ➔ Central de notificações
- `PUT /account/admin/common/notifications/read` ➔ Marca notificações como lidas

---

## 4. Testes

- Testes unitários com Sinon cobrindo atualização de senha, perfil e notificações (`*.spec.ts`).
- Teste de browser em `framework/test/logout_browser.ts`.

# Módulo de Gestão de Dashboards (`admin/settings/dashboard_management`)

> **Localização:** `app/modules/admin/settings/dashboard_management`  
> **Status:** `IMPLEMENTED`  
> **Última Atualização:** 15 de Agosto de 2026

---

## 1. Visão Geral e Responsabilidades

O módulo `dashboard_management` provê um motor para criação e customização dinâmica de painéis de controle (Dashboards) e widgets/itens analíticos:
- Criação de múltiplos painéis segmentados por perfil/role de usuário.
- Criação de widgets analíticos (gráficos ApexCharts, contadores, tabelas).
- Execução segura de consultas SQL associadas aos itens (`ExecuteItemQueryUseCase`).
- Reordenação e posicionamento visual dos elementos do painel.

---

## 2. Casos de Uso (16 Use Cases)

- `CreateDashboardUseCase`, `UpdateDashboardUseCase`, `DeleteDashboardUseCase`, `FindDashboardUseCase`, `ListDashboardsUseCase`, `UpdateDefaultDashboardUseCase`
- `CreateDashboardItemUseCase`, `UpdateDashboardItemUseCase`, `UpdateDashboardItemsUseCase`, `DeleteDashboardItemUseCase`, `FindDashboardItemUseCase`, `ListDashboardItemsUseCase`
- `AttachDashboardItemUseCase`, `DetachDashboardItemUseCase`, `ExecuteItemQueryUseCase`, `ListDashboardDetailsUseCase`

---

## 3. Endpoints

- Rotas completas sob `/account/admin/settings/dashboards/*` protegidas por `middleware.can('admin-dashboard-management-*')`.
- Rota de execução de queries de widgets sob `/api/admin/settings/dashboards/query`.

---

## 4. Testes Automatizados

Possui uma das maiores suítes de teste do projeto:
- 16 testes unitários (`usecases/*/*.spec.ts`).
- 6 testes de integração (`framework/test/integration/*.test.ts`).
- 7 testes E2E com Playwright Browser (`framework/test/e2e/*.test.browser.ts`).

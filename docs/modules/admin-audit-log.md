# Módulo de Auditoria e Logs (`admin/audit/log`)

> **Localização:** `app/modules/admin/audit/log`  
> **Status:** `IMPLEMENTED`  
> **Última Atualização:** 15 de Agosto de 2026

---

## 1. Visão Geral e Responsabilidades

O módulo `admin/audit/log` é responsável pela rastreabilidade e auditoria de segurança da plataforma:
- Visualização de logs operacionais registrados nas coleções do MongoDB.
- Filtragem avançada por usuário, tipo de operação, período e status de sucesso/erro.
- Extração e exportação de relatórios de auditoria em formatos estruturados.

---

## 2. Casos de Uso

| Caso de Uso | Diretório | Descrição |
| :--- | :--- | :--- |
| `ViewLogsUseCase` | `usecases/view_logs/` | Consulta registros paginados de log com filtros no MongoDB |
| `ExtractLogsUseCase` | `usecases/extract_logs/` | Extrai e formata logs para download / relatórios |

---

## 3. Endpoints e Proteção

| Método | Rota | Permissão Requerida | Descrição |
| :--- | :--- | :--- | :--- |
| `GET` | `/account/admin/audit/logs` | `admin-audit-view-logs` | Visualiza o painel de logs de auditoria |
| `GET` | `/account/admin/audit/logs/extract`| `admin-audit-export-logs`| Realiza o download dos logs filtrados |

---

## 4. Testes Automatizados

- Teste de entidade: `app/modules/admin/audit/log/domain/entity/log_entity.spec.ts`
- Testes unitários do caso de uso: `view_logs_usecase_impl.spec.ts`
- Testes de integração e browser:
  - `framework/tests/integration/view_logs.test.ts`
  - `framework/tests/integration/extract_logs.test.browser.ts`
  - `framework/tests/e2e/view_logs_test_browser.ts`

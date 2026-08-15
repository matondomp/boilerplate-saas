# Módulo Compartilhado (`shared`)

> **Localização:** `app/modules/shared`  
> **Status:** `IMPLEMENTED`  
> **Última Atualização:** 15 de Agosto de 2026

---

## 1. Visão Geral e Responsabilidades

O módulo `shared` é a espinha dorsal de infraestrutura e dados do boilerplate. Ele fornece os modelos e tabelas mestres compartilhados por todos os módulos, o barramento de mensageria assíncrona (Outbox/Inbox), processamento de filas em segundo plano, modelos NoSQL de telemetria no MongoDB e adaptadores de utilidades.

---

## 2. Modelos de Banco de Dados e Migrações (MySQL via Lucid)

| Tabela MySQL | Model Lucid | Responsabilidade |
| :--- | :--- | :--- |
| `core_users` | `CoreUserModel` | Usuários do sistema, credenciais, avatar, timezone e locale |
| `core_roles` | `CoreRoleModel` | Perfis de acesso / papéis no sistema (ex: root, admin, operator) |
| `core_permissions` | `CorePermissionModel` | Catálogo de permissões granulares de acesso |
| `core_role_permissions`| `CoreRolePermissionModel` | Tabela pivô associando roles a permissões |
| `core_menus` | `CoreMenuModel` | Estrutura de menus dinâmicos e permissões necessárias para exibição |
| `core_statuses` | `CoreStatusModel` | Estados genéricos padronizados no sistema |
| `core_application_settings` | `CoreApplicationSettingsModel`| Configurações de branding (cores, logos, nome da aplicação) |
| `core_outbox_messages` | `CoreOutboxMessageModel` | Fila transacional de eventos a enviar para outros módulos |
| `core_inbox_messages` | `CoreInboxMessagesModel` | Fila transacional de eventos recebidos para processamento |
| `core_remember_me_tokens` | Lucid Token | Tokens seguros de persistência de sessão "Lembrar-me" |
| `core_db_sync_seeds` | `CoreDbSyncModel` | Registro de controle das seeders já executadas via `node ace db:sync` |

---

## 3. Modelos e Coleções NoSQL (MongoDB)

| Coleção MongoDB | Schema TypeScript | Propósito | Índices Automáticos |
| :--- | :--- | :--- | :--- |
| `CoreUserActivities` | `CoreUserActivitySchema` | Registro detalhado de cada ação HTTP de usuário (IP, rota, operação, sessão) | `{ userId: 1, createdAt: -1 }`, `{ sessionId: 1, createdAt: -1 }` |
| `CoreNotifications` | `CoreNotificationEventSchema`| Histórico e estado (lida/não lida) de notificações do usuário | `{ userId: 1, createdAt: -1 }` |

---

## 4. Jobs e Processamento em Fila (BullMQ)

Os jobs estão registrados em `start/jobs.ts` e são processados pelo daemon `node ace queue:listen`:

1. **`CoreOutboxProcessorJob`:**
   - Varre a tabela `core_outbox_messages` onde `sentAt IS NULL` com trava `skipLocked()`.
   - Publica o evento no barramento `EventServiceBusImpl`.
   - Atualiza `sentAt` para a data/hora atual.
2. **`CoreSharedInboxProcessor`:**
   - Varre a tabela `core_inbox_messages` com status `PENDING` para o responsável `CORE_SHARED`.
   - Executa os processadores dedicados:
     - `CoreBroadcastEnum.SEND_EMAIL` ➔ `SendEmailProcessor` (agenda envio via `CoreSendEmailJob`).
     - `CoreBroadcastEnum.NOTIFY` ➔ `SaveNotificationProcessor` (persiste notificação e emite via WebSocket).
     - `CoreBroadcastEnum.REGISTER_LOG` ➔ `SaveLogProcessor` (grava log de auditoria no MongoDB).
     - `CoreBroadcastEnum.TRACK_ACTIVITY` ➔ `SaveActivityProcessor` (grava telemetria no MongoDB).
   - Ao concluir, remove o registro do Outbox e do Inbox para limpeza de base.
3. **`CoreSendEmailJob`:**
   - Envia e-mails formatados via serviço `@adonisjs/mail` com templates Edge/HTML.

---

## 5. Adaptadores de Infraestrutura Exportados

- `CarboneDocumentGeneratorAdapter`: Geração de relatórios e documentos formatados em PDF, DOCX, ODS e XLSX através da biblioteca Carbone (`carbone`).
- `DateAdapterImpl`: Manipulação e formatação de datas via Luxon (`luxon`).
- `EmailServiceAdapterImpl`: Envio de e-mails transacionais.
- `EventServiceBusImpl`: Barramento singleton para emissão e subscrição de eventos assíncronos.

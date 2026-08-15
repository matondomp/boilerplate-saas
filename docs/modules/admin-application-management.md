# Módulo de Configurações da Aplicação (`admin/settings/application_management`)

> **Localização:** `app/modules/admin/settings/application_management`  
> **Status:** `IMPLEMENTED`  
> **Última Atualização:** 15 de Agosto de 2026

---

## 1. Visão Geral e Responsabilidades

O módulo `application_management` permite a personalização visual e institucional do sistema em tempo de execução:
- Configuração do nome da empresa / aplicação.
- Upload e gestão de Logotipo institucional e Favicon.
- Definição do esquema de cores primária e secundária (com validação estrita via Value Object `Color`).
- Disponibilização global dessas variáveis para o frontend via Inertia Shared Props (`InertiaProtocol`).

---

## 2. Casos de Uso

| Caso de Uso | Diretório | Descrição |
| :--- | :--- | :--- |
| `FindAppSettingUseCase` | `usecases/find_app_setting/` | Recupera as configurações visuais ativas |
| `PersistAppSettingUseCase` | `usecases/persist_app_setting/` | Salva e atualiza as configurações da aplicação |

---

## 3. Endpoints

- `GET /account/admin/settings/application` ➔ Visualiza formulário de configurações (`admin-application-management-view`)
- `POST /account/admin/settings/application` ➔ Salva alterações (`admin-application-management-modify`)

---

## 4. Testes

- Teste de Entidade: `domain/entities/application_settings_entity.spec.ts`
- Teste de Value Object: `domain/value_objects/color.spec.ts`
- Testes Unitários: `find_app_setting_usecase_impl.spec.ts`, `persist_app_setting_usecase_impl.spec.ts`.

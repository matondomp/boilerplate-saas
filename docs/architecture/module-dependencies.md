# Regras de Dependências Entre Módulos (Module Dependencies Rules)

> **Status:** `[IMPLEMENTADO / NORMATIVO]`

---

## 1. Princípio Fundamental de Acoplamento

No Monólito Modular deste boilerplate, cada módulo é uma unidade funcional isolada. A violação das regras de dependência destrói a modularidade e reintroduz um monólito acoplado de difícil manutenção.

### Regras Mandatórias de Dependência

| Origem | Destino | Permitido? | Canal Permitido | Justificativa |
| :--- | :--- | :---: | :--- | :--- |
| Qualquer Módulo | `@core/*` | **SIM** | Imports TypeScript diretos | `@core` contém contratos fundamentais puros sem dependências de infraestrutura de negócio. |
| Qualquer Módulo | `#shared/*` | **SIM** | Imports TypeScript diretos | `#shared` exporta modelos base (`CoreUserModel`, `CoreRoleModel`), utilitários comuns e adaptadores de sistema. |
| Módulo A (Core) | Módulo B (Core) | **NÃO** (Direto) | Apenas via **Eventos / Outbox / Inbox** | Módulos de domínio não devem importar repositórios, usecases ou models de outros módulos. |
| Módulo em `addons/` | Outro Addon | **NÃO** (Direto) | Apenas via **Eventos / Outbox / Inbox** | Addons devem poder ser instalados ou removidos sem quebrar outros addons. |
| Domínio (`domain/`) | Camada Externa (`framework/`) | **NUNCA** | **PROIBIDO** | A regra de dependência da Clean Architecture exige que o Domínio seja agnóstico a controllers, HTTP, banco de dados ou views. |
| Usecases (`usecases/`) | Framework (`framework/`) | **NUNCA** | **PROIBIDO** | Casos de uso dependem de interfaces abstratas (`ports/`), nunca de implementações de repositórios concretas ou classes Lucid. |

---

## 2. Mapa de Imports Permitidos no `package.json`

O arquivo `package.json` define aliases para resolução de módulos no TypeScript:

```json
"imports": {
  "#core/*": "./@core/*.js",
  "#app/*": "./app/framework/*.js",
  "#modules/*": "./app/modules/*.js",
  "#shared/*": "./app/modules/shared/*.js",
  "#addons/*": "./app/modules/addons/*.js",
  "#providers/*": "./providers/*.js",
  "#database/*": "./database/*.js",
  "#tests/*": "./tests/*.js",
  "#start/*": "./start/*.js",
  "#config/*": "./config/*.js"
}
```

### Regras de Uso dos Aliases:
1. Use `#core/*` para importar tipos de `@core/domain` ou `@core/ports`.
2. Use `#shared/*` para modelos globais (`CoreUserModel`, `CoreRoleModel`, etc.) ou jobs compartilhados.
3. **NUNCA** faça import relativo que escape da raiz do seu módulo para acessar arquivos internos de outro módulo (ex: `../../../../admin/settings/acl/roles_management/usecases/...` é **ESTRITAMENTE PROIBIDO**).

---

## 3. Comunicação Inter-Módulos

Quando o Módulo `A` precisa notificar o Módulo `B` sobre uma alteração de estado (ex: `CRM` precisa registrar uma atividade de auditoria no `AuditLog` ou enviar uma notificação no `AdminCommon`):

```text
[Módulo A: CRM]
      │
      ▼
Salva dados no MySQL (Transação ACID)
      │
      ▼
Grava mensagem no Outbox (core_outbox_messages)
      │
══════╪══════════════════════════════════════════════════ (Assíncrono via BullMQ)
      │
      ▼
[CoreOutboxProcessorJob]
      │
      ▼
[EventServiceBus / MessageBus]
      │
      ▼
[CoreSharedInboxProcessor] / [Módulo B: Inbox Messages Job]
      │
      ▼
Executa ação no Módulo B sem acoplamento direto de código!
```

---

## 4. Gestão de Dependências de Addons (`app/modules/addons/*`)

Módulos adicionais localizados em `app/modules/addons/` podem possuir seu próprio manifesto de dependências (`module.json` ou `package.json`).

Para sincronizar e instalar as dependências de todos os addons instalados:
```bash
node ace install:addon:deps
```
Este comando lê automaticamente todos os arquivos `module.json` sob `app/modules/addons/` e instala os pacotes npm necessários via `@antfu/install-pkg` sem alterar permanentemente o manifesto raiz em desenvolvimento.

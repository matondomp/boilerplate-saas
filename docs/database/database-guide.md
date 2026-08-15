# Guia de Banco de Dados e Persistência (Database Guide)

> **Status:** `[IMPLEMENTADO / NORMATIVO]`  
> **Evidências:** `config/database.ts`, `commands/db_sync.ts`, `providers/app_provider.ts`, `app/framework/db/`.

---

## 1. Arquitetura de Persistência Dual

O sistema adota uma divisão estratégica entre persistência relacional transacional e não-relacional:

```text
┌──────────────────────────────────────────────────────────────────────────┐
│                         PERSISTÊNCIA DE DADOS                            │
├─────────────────────────────────────┬────────────────────────────────────┤
│           MySQL 8.x (Lucid)         │             MongoDB                │
├─────────────────────────────────────┼────────────────────────────────────┤
│ • Dados transacionais ACID          │ • Logs de auditoria volumosos      │
│ • Entidades de negócio relacionais  │ • Histórico de telemetria e ações  │
│ • Mapeamento O/R via Lucid Models   │ • Notificações em tempo real       │
│ • Migrations versionadas            │ • Índices automáticos no boot      │
└─────────────────────────────────────┴────────────────────────────────────┘
```

---

## 2. Convenções para Tabelas MySQL

1. **Prefixo Obrigatório por Módulo:**
   - Tabelas nativas do Core/Shared: prefixo `core_` (ex: `core_users`, `core_roles`, `core_menus`).
   - Tabelas de Addons: prefixo do addon (ex: `crm_clients`, `pedagogy_grades`).
2. **Chaves Primárias (PK):**
   - Todas as tabelas devem usar UUID v4 (`varchar(36)`) como chave primária.
3. **Colunas de Auditoria e Timestamps:**
   - `created_at`: `timestamp` (NOT NULL, default CURRENT_TIMESTAMP).
   - `updated_at`: `timestamp` (NULL).
   - `deleted_at`: `timestamp` (NULL, para suporte a soft deletes).
4. **Tabela de Controle de Migrações:**
   - Nomeada `core_schemas` (definida em `config/database.ts`).

---

## 3. Estrutura Padrão de Migration

Arquivo: `app/modules/<module>/framework/infra/db/migrations/<timestamp>_create_<table_name>_table.ts`

```typescript
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'crm_clients'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 36).primary()
      table.string('name').notNullable()
      table.string('tax_number', 30).notNullable().unique()
      table.string('user_id', 36).references('id').inTable('core_users').onDelete('CASCADE')

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).nullable()
      table.timestamp('deleted_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
```

---

## 4. Models Lucid e Mappers

### 4.1. Definição do Model Lucid
```typescript
import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export class ClientModel extends BaseModel {
  static table = 'crm_clients'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare taxNumber: string

  @column()
  declare userId: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @column.dateTime()
  declare deletedAt: DateTime | null
}
```

### 4.2. Padrão Mapper (Domain ➔ Persistence ➔ Domain)
```typescript
import { Mapper } from '#core/domain/index'
import { ClientEntity } from '../../../domain/customer/entities/client_entity.js'
import { ClientModel } from '../models/client_model.js'
import { UniqueEntityID } from '#core/domain/index'

export class ClientMapper extends Mapper<ClientEntity, ClientModel> {
  toDomain(raw: ClientModel): ClientEntity {
    return ClientEntity.hydrate(
      new UniqueEntityID(raw.id),
      {
        name: raw.name,
        taxNumber: raw.taxNumber,
        userId: new UniqueEntityID(raw.userId),
      },
      {
        createdAt: raw.createdAt.toJSDate(),
        updatedAt: raw.updatedAt?.toJSDate(),
        deletedAt: raw.deletedAt?.toJSDate(),
      }
    )
  }

  async toPersistence(entity: ClientEntity): Promise<ClientModel> {
    const model = new ClientModel()
    model.id = entity.id.toString()
    model.name = entity.name
    model.taxNumber = entity.taxNumber
    model.userId = entity.userId.toString()
    return model
  }
}
```

---

## 5. Transações de Banco de Dados Desacopladas

Sempre que uma operação envolver mutações em múltiplas tabelas, utilize o `TransactionAdapter`:

```typescript
export class CreateRoleUseCaseImpl {
  constructor(
    private readonly transactionAdapter: TransactionAdapter,
    private readonly createRoleRepo: CreateRoleWithTransactionRepository
  ) {}

  async perform(input: CreateRoleInput) {
    // ...
    await this.transactionAdapter.useTransaction(async (trx) => {
      await this.createRoleRepo.persistWithTransaction(entity, trx)
    })
    // ...
  }
}
```

---

## 6. Sincronização Inteligente de Seeders (`node ace db:sync`)

O boilerplate possui um comando inteligente de sincronização de seeds:

```bash
node ace db:sync
```

### Como Funciona:
1. O comando `DatabaseSyncronize` (`commands/db_sync.ts`) descobre todos os seeders nos módulos.
2. Compara a lista de arquivos com os registros da tabela `core_db_sync_seeds`.
3. Executa **apenas os seeders inéditos**, garantindo que os seeders do módulo `shared` sejam executados antes dos demais.
4. Registra cada seeder executado com sucesso na tabela de controle.

---

## 7. MongoDB (NoSQL) para Logs e Telemetria

- O cliente é gerenciado em `app/framework/db/mongodb/index.ts`.
- Conexão aberta no boot e encerrada no shutdown (`providers/app_provider.ts`).
- Criação automática de índices na inicialização (`installIndexesOnCoreUserActivity()`, `installIndexOnCoreNotificationEventModel()`).

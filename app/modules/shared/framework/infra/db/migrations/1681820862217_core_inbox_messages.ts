import { StatusEnum } from '#shared/domain/types/status_type'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'core_inbox_messages'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary().unique().index().notNullable()

      table.string('responsible').notNullable()
      table.string('type').index().notNullable()
      table.json('payload').notNullable()
      table.string('meta_user_id').nullable()
      table
        .string('meta_outbox_id')
        .notNullable()
        .references('id')
        .inTable('core_outbox_messages')
        .onDelete('CASCADE')

      table
        .enum('status', [StatusEnum.PENDING, StatusEnum.STARTED, StatusEnum.FAILED])
        .notNullable()
      table.boolean('complete').notNullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

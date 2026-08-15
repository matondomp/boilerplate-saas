import { BaseSchema } from '@adonisjs/lucid/schema'

export default class ApiTokens extends BaseSchema {
  protected tableName = 'core_tokens'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').unique().primary()

      table.string('user_id').references('id').inTable('core_users')

      table.string('type').notNullable()
      table.boolean('is_revoked').defaultTo(false)
      table.string('token', 64).notNullable().unique()

      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('expires_at', { useTz: true }).nullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

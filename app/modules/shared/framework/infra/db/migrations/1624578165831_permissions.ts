import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Permissions extends BaseSchema {
  protected tableName = 'core_permissions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').unique().primary()
      table.string('name').notNullable()
      table.text('description').nullable()
      table.text('group').notNullable()
      table.boolean('internal').notNullable().defaultTo(false)

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

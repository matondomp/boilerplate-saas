import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'core_notifications_users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').index().primary().unique()

      table.enum('type', ['email', 'platform']).index()

      table
        .string('notification_id')
        .notNullable()
        .references('id')
        .inTable('core_notifications')
        .onDelete('CASCADE')

      table
        .string('user_id')
        .notNullable()
        .references('id')
        .inTable('core_users')
        .onDelete('CASCADE')

      table.unique(['type', 'notification_id', 'user_id'])

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

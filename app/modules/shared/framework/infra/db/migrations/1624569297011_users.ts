import { BaseSchema } from '@adonisjs/lucid/schema'

export default class UsersSchema extends BaseSchema {
  protected tableName = 'core_users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').notNullable().unique().primary()
      table.string('first_name', 255).notNullable()
      table.string('last_name', 255).nullable()
      table.string('slug', 255).notNullable().unique().index()
      table.string('email', 255).notNullable().unique().index()
      table.string('password', 180).notNullable()
      table.string('avatar_url').nullable()
      table.boolean('force_change_password').defaultTo(true)
      table.string('status_id').index()
      table.datetime('last_login').nullable()
      table.foreign('status_id').references('id').inTable('core_statuses').onDelete('cascade')

      table.unique(['id', 'status_id'])
      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('deleted_at').nullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

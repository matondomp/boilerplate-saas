import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'core_tokens'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('id')
      table.renameColumn('user_id', 'tokenable_id')
      table.timestamp('updated_at')
      table.renameColumn('token', 'hash')
      table.timestamp('last_used_at').nullable()
      table.string('name').nullable()
      table.text('abilities').notNullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.increments('id')
      table.renameColumn('tokenable_id', 'user_id')

      table.dropColumns('name', 'abilities', 'updated_at', 'last_used_at')

      table.renameColumn('hash', 'token')
    })
  }
}

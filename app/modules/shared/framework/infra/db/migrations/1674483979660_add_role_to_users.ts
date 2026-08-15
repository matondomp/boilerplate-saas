import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'core_users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('role_id').index().notNullable()

      table.foreign('role_id').references('id').inTable('core_roles').onDelete('cascade')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('role_id')
      table.dropIndex('role_id')
      table.dropColumn('role_id')
    })
  }
}

import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'core_dashboards'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('status_id')
      table.foreign('status_id').references('id').inTable('core_statuses').onDelete('cascade')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('status_id')
      table.dropColumn('status_id')
    })
  }
}

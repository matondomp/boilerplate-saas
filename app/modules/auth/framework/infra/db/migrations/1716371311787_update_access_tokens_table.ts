import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'core_tokens'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.increments('id')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('id')
    })
  }
}

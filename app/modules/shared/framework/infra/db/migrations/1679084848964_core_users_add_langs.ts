import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'core_users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('default_lang').defaultTo('pt').after('avatar_url')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('default_lang')
    })
  }
}

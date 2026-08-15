import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'core_users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .string('timezone')
        .notNullable()
        .index()
        .defaultTo('Africa/Luanda')
        .after('default_lang')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropIndex('timezone')
      table.dropColumn('timezone')
    })
  }
}

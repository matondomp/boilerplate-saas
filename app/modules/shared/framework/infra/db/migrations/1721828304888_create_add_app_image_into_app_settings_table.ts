import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'core_application_settings'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('image_url').nullable().after('app_desc')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('image_url')
    })
  }
}

import { BaseSchema } from '@adonisjs/lucid/schema'
import { ChartsArrayValues } from '#modules/admin/settings/dashboard_management/domain/types/chart_types'

export default class extends BaseSchema {
  protected tableName = 'core_dashboard_items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').unique().primary()
      table.string('name').notNullable()
      table.string('slug').notNullable().unique()
      table.string('sql_raw', 512).notNullable()
      table.enum('chart_type', ChartsArrayValues).notNullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

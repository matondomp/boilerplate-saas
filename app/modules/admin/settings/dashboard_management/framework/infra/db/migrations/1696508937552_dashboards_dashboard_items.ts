import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'core_dashboards_dashboard_items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').unique().primary()
      table
        .string('dashboard_slug')
        .references('slug')
        .inTable('core_dashboards')
        .notNullable()
        .onDelete('CASCADE')

      table
        .string('item_id')
        .references('id')
        .inTable('core_dashboard_items')
        .notNullable()
        .onDelete('CASCADE')

      table.decimal('x')
      table.decimal('y')
      table.decimal('width')
      table.decimal('height')
      table.unique(['dashboard_slug', 'item_id'])
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

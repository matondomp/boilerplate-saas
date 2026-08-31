import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'acad_academic_units'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 36).primary().notNullable()
      table
        .string('university_id', 36)
        .notNullable()
        .references('id')
        .inTable('acad_universities')
        .onDelete('RESTRICT')
      table.string('name', 255).notNullable()
      table.string('type', 100).notNullable().defaultTo('Faculdade')

      table.timestamp('deleted_at', { useTz: true }).nullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

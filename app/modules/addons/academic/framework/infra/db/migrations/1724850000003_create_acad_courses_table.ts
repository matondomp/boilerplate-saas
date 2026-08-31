import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'acad_courses'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 36).primary().notNullable()
      table
        .string('university_id', 36)
        .notNullable()
        .references('id')
        .inTable('acad_universities')
        .onDelete('RESTRICT')
      table
        .string('academic_unit_id', 36)
        .nullable()
        .references('id')
        .inTable('acad_academic_units')
        .onDelete('SET NULL')
      table.string('name', 255).notNullable()
      table.enum('status', ['ACTIVE', 'INACTIVE']).defaultTo('ACTIVE').notNullable()

      table.unique(['university_id', 'name'])

      table.timestamp('deleted_at', { useTz: true }).nullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

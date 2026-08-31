import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'eval_exams'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 36).primary().notNullable()
      table
        .string('course_id', 36)
        .notNullable()
        .references('id')
        .inTable('acad_courses')
        .onDelete('RESTRICT')
      table.integer('year').notNullable()
      table.string('period', 50).notNullable()
      table.string('source_type', 50).notNullable().defaultTo('OFFICIAL_EXAM')
      table.json('source_metadata').nullable()
      table.string('document_url', 500).nullable()
      table.string('status', 50).defaultTo('DRAFT').notNullable()

      table.unique(['course_id', 'year', 'period'])

      table.timestamp('deleted_at', { useTz: true }).nullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

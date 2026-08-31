import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'acad_course_subjects'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 36).primary().notNullable()
      table
        .string('course_id', 36)
        .notNullable()
        .references('id')
        .inTable('acad_courses')
        .onDelete('CASCADE')
      table
        .string('subject_id', 36)
        .notNullable()
        .references('id')
        .inTable('acad_subjects')
        .onDelete('CASCADE')

      table.unique(['course_id', 'subject_id'], 'acad_course_subj_unique')

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

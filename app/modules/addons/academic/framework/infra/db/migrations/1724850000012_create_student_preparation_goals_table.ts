import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'student_preparation_goals'

  async up() {
    this.schema.dropTableIfExists(this.tableName)
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 36).primary().notNullable()
      table
        .string('student_id', 36)
        .notNullable()
        .references('id')
        .inTable('core_users')
        .onDelete('RESTRICT')
      table
        .string('university_id', 36)
        .notNullable()
        .references('id')
        .inTable('acad_universities')
        .onDelete('RESTRICT')
      table
        .string('course_id', 36)
        .notNullable()
        .references('id')
        .inTable('acad_courses')
        .onDelete('RESTRICT')
      table.string('target_exam_period', 50).nullable()
      table.enum('status', ['ACTIVE', 'ARCHIVED']).defaultTo('ACTIVE').notNullable()

      table.index(['student_id', 'status'])

      table.timestamp('deleted_at', { useTz: true }).nullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

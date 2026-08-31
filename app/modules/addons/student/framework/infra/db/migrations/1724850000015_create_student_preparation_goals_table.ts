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
        .inTable('students')
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
      table
        .string('target_exam_id', 36)
        .nullable()
        .references('id')
        .inTable('eval_exams')
        .onDelete('SET NULL')
      table.integer('target_year').notNullable()
      table.string('target_exam_period', 50).nullable()
      table.dateTime('target_date', { useTz: true }).nullable()
      table
        .enum('status', ['ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED', 'ARCHIVED'])
        .defaultTo('ACTIVE')
        .notNullable()
      table.boolean('is_primary').defaultTo(false).notNullable()
      table.dateTime('started_at', { useTz: true }).nullable()
      table.dateTime('completed_at', { useTz: true }).nullable()

      table.unique(['student_id', 'university_id', 'course_id', 'target_year'], {
        indexName: 'unique_student_course_year_goal',
      })
      table.index(['student_id', 'status'])
      table.index(['student_id', 'is_primary'])

      table.timestamp('deleted_at', { useTz: true }).nullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

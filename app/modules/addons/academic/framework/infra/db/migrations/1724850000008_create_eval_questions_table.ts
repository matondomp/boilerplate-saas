import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'eval_questions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 36).primary().notNullable()
      table
        .string('exam_id', 36)
        .nullable()
        .references('id')
        .inTable('eval_exams')
        .onDelete('SET NULL')
      table
        .string('subject_id', 36)
        .notNullable()
        .references('id')
        .inTable('acad_subjects')
        .onDelete('RESTRICT')
      table
        .string('topic_id', 36)
        .notNullable()
        .references('id')
        .inTable('acad_topics')
        .onDelete('RESTRICT')
      table.string('type', 50).notNullable().defaultTo('SINGLE_CHOICE')
      table.text('statement').notNullable()
      table.string('difficulty', 50).notNullable().defaultTo('MEDIUM')
      table.text('solution', 'longtext').nullable()
      table.text('explanation', 'longtext').nullable()
      table.string('source', 50).notNullable().defaultTo('OFFICIAL_EXAM')
      table.json('source_metadata').nullable()
      table.string('status', 50).defaultTo('DRAFT').notNullable()
      table.integer('version').defaultTo(1).notNullable()

      table.index(['status', 'subject_id', 'topic_id'], 'eval_questions_status_subj_topic_idx')

      table.timestamp('deleted_at', { useTz: true }).nullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'eval_question_revisions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 36).primary().notNullable()
      table
        .string('question_id', 36)
        .notNullable()
        .references('id')
        .inTable('eval_questions')
        .onDelete('CASCADE')
      table.integer('revision_number').notNullable()
      table
        .string('author_id', 36)
        .notNullable()
        .references('id')
        .inTable('core_users')
        .onDelete('RESTRICT')
      table.text('changes_summary').notNullable()
      table.json('snapshot_data').notNullable()
      table.string('reason', 255).notNullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

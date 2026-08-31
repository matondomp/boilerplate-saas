import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'eval_question_options'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 36).primary().notNullable()
      table
        .string('question_id', 36)
        .notNullable()
        .references('id')
        .inTable('eval_questions')
        .onDelete('CASCADE')
      table.string('label', 10).notNullable()
      table.text('content').notNullable()
      table.integer('position').defaultTo(0).notNullable()
      table.boolean('is_correct').defaultTo(false).notNullable()

      table.unique(['question_id', 'label'])

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

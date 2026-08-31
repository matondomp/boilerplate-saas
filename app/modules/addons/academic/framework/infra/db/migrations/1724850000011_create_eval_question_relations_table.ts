import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'eval_question_relations'

  async up() {
    this.schema.dropTableIfExists(this.tableName)
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 36).primary().notNullable()
      table
        .string('source_question_id', 36)
        .notNullable()
        .references('id')
        .inTable('eval_questions')
        .onDelete('CASCADE')
      table
        .string('target_question_id', 36)
        .notNullable()
        .references('id')
        .inTable('eval_questions')
        .onDelete('CASCADE')
      table.enum('relation_type', ['SAME_AS', 'SIMILAR_TO']).notNullable()

      table.unique(['source_question_id', 'target_question_id'], 'eval_q_relations_src_tgt_unique')

      table.timestamp('created_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

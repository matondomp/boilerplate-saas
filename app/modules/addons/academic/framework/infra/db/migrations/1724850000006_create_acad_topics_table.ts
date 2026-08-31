import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'acad_topics'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 36).primary().notNullable()
      table
        .string('subject_id', 36)
        .notNullable()
        .references('id')
        .inTable('acad_subjects')
        .onDelete('RESTRICT')
      table
        .string('parent_id', 36)
        .nullable()
        .references('id')
        .inTable('acad_topics')
        .onDelete('RESTRICT')
      table.string('name', 255).notNullable()
      table.integer('level').defaultTo(1).notNullable()
      table.integer('position').defaultTo(0).notNullable()

      table.timestamp('deleted_at', { useTz: true }).nullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

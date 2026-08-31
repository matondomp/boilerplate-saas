import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'student_profiles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 36).primary().notNullable()
      table
        .string('student_id', 36)
        .notNullable()
        .unique()
        .references('id')
        .inTable('students')
        .onDelete('CASCADE')
      table.string('full_name', 255).notNullable()
      table.string('phone', 50).nullable()
      table.string('avatar_url', 500).nullable()
      table.string('preferred_language', 10).defaultTo('pt').notNullable()
      table.integer('birth_year').nullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

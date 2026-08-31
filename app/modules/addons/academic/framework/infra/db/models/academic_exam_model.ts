import { randomUUID } from 'node:crypto'
import { DateTime } from 'luxon'
import { BaseModel, beforeSave, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { softDelete } from '#shared/framework/infra/db/adapters/soft_delete_adapter'
import { AcademicCourseModel } from './academic_course_model.js'
import { AcademicQuestionModel } from './academic_question_model.js'

export class AcademicExamModel extends BaseModel {
  static table = 'eval_exams'
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column({ columnName: 'course_id' })
  declare courseId: string

  @column()
  declare year: number

  @column()
  declare period: string

  @column({ columnName: 'source_type' })
  declare sourceType: string

  @column({
    columnName: 'source_metadata',
    prepare: (value: any) => (value ? JSON.stringify(value) : null),
    consume: (value: any) => (typeof value === 'string' ? JSON.parse(value) : value),
  })
  declare sourceMetadata?: Record<string, any> | null

  @column({ columnName: 'document_url' })
  declare documentUrl?: string | null

  @column()
  declare status: string

  @belongsTo(() => AcademicCourseModel, {
    foreignKey: 'courseId',
  })
  declare course: BelongsTo<typeof AcademicCourseModel>

  @hasMany(() => AcademicQuestionModel, {
    foreignKey: 'examId',
  })
  declare questions: HasMany<typeof AcademicQuestionModel>

  @column.dateTime()
  declare deletedAt?: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeSave()
  static async setId(model: AcademicExamModel) {
    model.id = model.id || randomUUID()
  }

  async softDelete() {
    await softDelete(this)
  }
}

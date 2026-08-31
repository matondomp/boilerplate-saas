import { randomUUID } from 'node:crypto'
import { DateTime } from 'luxon'
import { BaseModel, beforeSave, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { softDelete } from '#shared/framework/infra/db/adapters/soft_delete_adapter'
import { AcademicExamModel } from './academic_exam_model.js'
import { AcademicSubjectModel } from './academic_subject_model.js'
import { AcademicTopicModel } from './academic_topic_model.js'
import { AcademicQuestionOptionModel } from './academic_question_option_model.js'
import { AcademicQuestionRevisionModel } from './academic_question_revision_model.js'

export class AcademicQuestionModel extends BaseModel {
  static table = 'eval_questions'
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column({ columnName: 'exam_id' })
  declare examId?: string | null

  @column({ columnName: 'subject_id' })
  declare subjectId: string

  @column({ columnName: 'topic_id' })
  declare topicId: string

  @column()
  declare type: string

  @column()
  declare statement: string

  @column()
  declare difficulty: string

  @column()
  declare solution?: string | null

  @column()
  declare explanation?: string | null

  @column()
  declare source: string

  @column({
    columnName: 'source_metadata',
    prepare: (value: any) => (value ? JSON.stringify(value) : null),
    consume: (value: any) => (typeof value === 'string' ? JSON.parse(value) : value),
  })
  declare sourceMetadata?: Record<string, any> | null

  @column()
  declare status: string

  @column()
  declare version: number

  @belongsTo(() => AcademicExamModel, {
    foreignKey: 'examId',
  })
  declare exam: BelongsTo<typeof AcademicExamModel>

  @belongsTo(() => AcademicSubjectModel, {
    foreignKey: 'subjectId',
  })
  declare subject: BelongsTo<typeof AcademicSubjectModel>

  @belongsTo(() => AcademicTopicModel, {
    foreignKey: 'topicId',
  })
  declare topic: BelongsTo<typeof AcademicTopicModel>

  @hasMany(() => AcademicQuestionOptionModel, {
    foreignKey: 'questionId',
  })
  declare options: HasMany<typeof AcademicQuestionOptionModel>

  @hasMany(() => AcademicQuestionRevisionModel, {
    foreignKey: 'questionId',
  })
  declare revisions: HasMany<typeof AcademicQuestionRevisionModel>

  @column.dateTime()
  declare deletedAt?: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeSave()
  static async setId(model: AcademicQuestionModel) {
    model.id = model.id || randomUUID()
  }

  async softDelete() {
    await softDelete(this)
  }
}

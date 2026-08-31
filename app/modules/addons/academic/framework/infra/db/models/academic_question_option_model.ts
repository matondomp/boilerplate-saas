import { randomUUID } from 'node:crypto'
import { DateTime } from 'luxon'
import { BaseModel, beforeSave, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { AcademicQuestionModel } from './academic_question_model.js'

export class AcademicQuestionOptionModel extends BaseModel {
  static table = 'eval_question_options'
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column({ columnName: 'question_id' })
  declare questionId: string

  @column()
  declare label: string

  @column()
  declare content: string

  @column()
  declare position: number

  @column({ columnName: 'is_correct' })
  declare isCorrect: boolean

  @belongsTo(() => AcademicQuestionModel, {
    foreignKey: 'questionId',
  })
  declare question: BelongsTo<typeof AcademicQuestionModel>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeSave()
  static async setId(model: AcademicQuestionOptionModel) {
    model.id = model.id || randomUUID()
  }
}

import { randomUUID } from 'node:crypto'
import { DateTime } from 'luxon'
import { BaseModel, beforeSave, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { AcademicQuestionModel } from './academic_question_model.js'

export class AcademicQuestionRelationModel extends BaseModel {
  static table = 'eval_question_relations'
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column({ columnName: 'source_question_id' })
  declare sourceQuestionId: string

  @column({ columnName: 'target_question_id' })
  declare targetQuestionId: string

  @column({ columnName: 'relation_type' })
  declare relationType: string

  @belongsTo(() => AcademicQuestionModel, {
    foreignKey: 'sourceQuestionId',
  })
  declare sourceQuestion: BelongsTo<typeof AcademicQuestionModel>

  @belongsTo(() => AcademicQuestionModel, {
    foreignKey: 'targetQuestionId',
  })
  declare targetQuestion: BelongsTo<typeof AcademicQuestionModel>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @beforeSave()
  static async setId(model: AcademicQuestionRelationModel) {
    model.id = model.id || randomUUID()
  }
}

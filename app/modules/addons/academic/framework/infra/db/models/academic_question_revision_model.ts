import { randomUUID } from 'node:crypto'
import { DateTime } from 'luxon'
import { BaseModel, beforeSave, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { AcademicQuestionModel } from './academic_question_model.js'
import { CoreUserModel } from '../../../../../../shared/framework/infra/db/models/core_user_model.js'

export class AcademicQuestionRevisionModel extends BaseModel {
  static table = 'eval_question_revisions'
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column({ columnName: 'question_id' })
  declare questionId: string

  @column({ columnName: 'revision_number' })
  declare revisionNumber: number

  @column({ columnName: 'author_id' })
  declare authorId: string

  @column({ columnName: 'changes_summary' })
  declare changesSummary: string

  @column({
    columnName: 'snapshot_data',
    prepare: (value: any) => (value ? JSON.stringify(value) : null),
    consume: (value: any) => (typeof value === 'string' ? JSON.parse(value) : value),
  })
  declare snapshotData: Record<string, any>

  @column()
  declare reason: string

  @belongsTo(() => AcademicQuestionModel, {
    foreignKey: 'questionId',
  })
  declare question: BelongsTo<typeof AcademicQuestionModel>

  @belongsTo(() => CoreUserModel, {
    foreignKey: 'authorId',
  })
  declare author: BelongsTo<typeof CoreUserModel>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @beforeSave()
  static async setId(model: AcademicQuestionRevisionModel) {
    model.id = model.id || randomUUID()
  }
}

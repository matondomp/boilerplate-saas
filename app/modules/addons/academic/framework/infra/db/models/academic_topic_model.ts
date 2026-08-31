import { randomUUID } from 'node:crypto'
import { DateTime } from 'luxon'
import { BaseModel, beforeSave, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { softDelete } from '#shared/framework/infra/db/adapters/soft_delete_adapter'
import { AcademicSubjectModel } from './academic_subject_model.js'

export class AcademicTopicModel extends BaseModel {
  static table = 'acad_topics'
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column({ columnName: 'subject_id' })
  declare subjectId: string

  @column({ columnName: 'parent_id' })
  declare parentId?: string | null

  @column()
  declare name: string

  @column()
  declare level: number

  @column()
  declare position: number

  @belongsTo(() => AcademicSubjectModel, {
    foreignKey: 'subjectId',
  })
  declare subject: BelongsTo<typeof AcademicSubjectModel>

  @belongsTo(() => AcademicTopicModel, {
    foreignKey: 'parentId',
  })
  declare parent: BelongsTo<typeof AcademicTopicModel>

  @hasMany(() => AcademicTopicModel, {
    foreignKey: 'parentId',
  })
  declare children: HasMany<typeof AcademicTopicModel>

  @column.dateTime()
  declare deletedAt?: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeSave()
  static async setId(model: AcademicTopicModel) {
    model.id = model.id || randomUUID()
  }

  async softDelete() {
    await softDelete(this)
  }
}

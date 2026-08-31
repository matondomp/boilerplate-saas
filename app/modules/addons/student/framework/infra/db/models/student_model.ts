import { randomUUID } from 'node:crypto'
import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column, hasOne, belongsTo } from '@adonisjs/lucid/orm'
import type { HasOne, BelongsTo } from '@adonisjs/lucid/types/relations'
import { softDelete } from '#shared/framework/infra/db/adapters/soft_delete_adapter'
import { StudentProfileModel } from './student_profile_model.js'
import CoreUserModel from '#shared/framework/infra/db/models/core_user_model'

export class StudentModel extends BaseModel {
  static table = 'students'
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column({ columnName: 'user_id' })
  declare userId: string

  @column()
  declare status: string

  @belongsTo(() => CoreUserModel, {
    foreignKey: 'userId',
  })
  declare user: BelongsTo<typeof CoreUserModel>

  @hasOne(() => StudentProfileModel, {
    foreignKey: 'studentId',
  })
  declare profile: HasOne<typeof StudentProfileModel>

  @column.dateTime()
  declare deletedAt?: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeSave()
  static async setId(model: StudentModel) {
    model.id = model.id || randomUUID()
  }

  async softDelete() {
    await softDelete(this)
  }
}

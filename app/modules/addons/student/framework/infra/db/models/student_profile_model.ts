import { randomUUID } from 'node:crypto'
import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { StudentModel } from './student_model.js'

export class StudentProfileModel extends BaseModel {
  static table = 'student_profiles'
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column({ columnName: 'student_id' })
  declare studentId: string

  @column({ columnName: 'full_name' })
  declare fullName: string

  @column()
  declare phone?: string | null

  @column({ columnName: 'avatar_url' })
  declare avatarUrl?: string | null

  @column({ columnName: 'preferred_language' })
  declare preferredLanguage: string

  @column({ columnName: 'birth_year' })
  declare birthYear?: number | null

  @belongsTo(() => StudentModel, {
    foreignKey: 'studentId',
  })
  declare student: BelongsTo<typeof StudentModel>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeSave()
  static async setId(model: StudentProfileModel) {
    model.id = model.id || randomUUID()
  }
}

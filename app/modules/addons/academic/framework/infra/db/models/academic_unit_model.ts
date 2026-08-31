import { randomUUID } from 'node:crypto'
import { DateTime } from 'luxon'
import { BaseModel, beforeSave, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { softDelete } from '#shared/framework/infra/db/adapters/soft_delete_adapter'
import { AcademicUniversityModel } from './academic_university_model.js'
import { AcademicCourseModel } from './academic_course_model.js'

export class AcademicUnitModel extends BaseModel {
  static table = 'acad_academic_units'
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column({ columnName: 'university_id' })
  declare universityId: string

  @column()
  declare name: string

  @column()
  declare type: string

  @belongsTo(() => AcademicUniversityModel, {
    foreignKey: 'universityId',
  })
  declare university: BelongsTo<typeof AcademicUniversityModel>

  @hasMany(() => AcademicCourseModel, {
    foreignKey: 'academicUnitId',
  })
  declare courses: HasMany<typeof AcademicCourseModel>

  @column.dateTime()
  declare deletedAt?: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeSave()
  static async setId(model: AcademicUnitModel) {
    model.id = model.id || randomUUID()
  }

  async softDelete() {
    await softDelete(this)
  }
}

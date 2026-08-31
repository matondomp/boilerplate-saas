import { randomUUID } from 'node:crypto'
import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { softDelete } from '#shared/framework/infra/db/adapters/soft_delete_adapter'
import { AcademicCourseModel } from './academic_course_model.js'
import { AcademicUnitModel } from './academic_unit_model.js'

export class AcademicUniversityModel extends BaseModel {
  static table = 'acad_universities'
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare acronym: string

  @column()
  declare status: string

  @hasMany(() => AcademicUnitModel, {
    foreignKey: 'universityId',
  })
  declare academicUnits: HasMany<typeof AcademicUnitModel>

  @hasMany(() => AcademicCourseModel, {
    foreignKey: 'universityId',
  })
  declare courses: HasMany<typeof AcademicCourseModel>

  @column.dateTime()
  declare deletedAt?: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeSave()
  static async setId(model: AcademicUniversityModel) {
    model.id = model.id || randomUUID()
  }

  async softDelete() {
    await softDelete(this)
  }
}

import { randomUUID } from 'node:crypto'
import { DateTime } from 'luxon'
import { BaseModel, beforeSave, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { softDelete } from '#shared/framework/infra/db/adapters/soft_delete_adapter'
import { AcademicUniversityModel } from './academic_university_model.js'
import { AcademicCourseModel } from './academic_course_model.js'

export class StudentPreparationGoalModel extends BaseModel {
  static table = 'student_preparation_goals'
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column({ columnName: 'student_id' })
  declare studentId: string

  @column({ columnName: 'university_id' })
  declare universityId: string

  @column({ columnName: 'course_id' })
  declare courseId: string

  @column({ columnName: 'target_exam_period' })
  declare targetExamPeriod?: string | null

  @column()
  declare status: string

  @belongsTo(() => AcademicUniversityModel, {
    foreignKey: 'universityId',
  })
  declare university: BelongsTo<typeof AcademicUniversityModel>

  @belongsTo(() => AcademicCourseModel, {
    foreignKey: 'courseId',
  })
  declare course: BelongsTo<typeof AcademicCourseModel>

  @column.dateTime()
  declare deletedAt?: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeSave()
  static async setId(model: StudentPreparationGoalModel) {
    model.id = model.id || randomUUID()
  }

  async softDelete() {
    await softDelete(this)
  }
}

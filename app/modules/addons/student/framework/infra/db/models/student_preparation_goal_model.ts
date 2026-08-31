import { randomUUID } from 'node:crypto'
import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { softDelete } from '#shared/framework/infra/db/adapters/soft_delete_adapter'
import { StudentModel } from './student_model.js'
import { AcademicUniversityModel } from '#addons/academic/framework/infra/db/models/academic_university_model'
import { AcademicCourseModel } from '#addons/academic/framework/infra/db/models/academic_course_model'
import { AcademicExamModel } from '#addons/academic/framework/infra/db/models/academic_exam_model'

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

  @column({ columnName: 'target_exam_id' })
  declare targetExamId?: string | null

  @column({ columnName: 'target_year' })
  declare targetYear: number

  @column({ columnName: 'target_exam_period' })
  declare targetExamPeriod?: string | null

  @column.dateTime({ columnName: 'target_date' })
  declare targetDate?: DateTime | null

  @column()
  declare status: string

  @column({ columnName: 'is_primary' })
  declare isPrimary: boolean

  @column.dateTime({ columnName: 'started_at' })
  declare startedAt?: DateTime | null

  @column.dateTime({ columnName: 'completed_at' })
  declare completedAt?: DateTime | null

  @belongsTo(() => StudentModel, {
    foreignKey: 'studentId',
  })
  declare student: BelongsTo<typeof StudentModel>

  @belongsTo(() => AcademicUniversityModel, {
    foreignKey: 'universityId',
  })
  declare university: BelongsTo<typeof AcademicUniversityModel>

  @belongsTo(() => AcademicCourseModel, {
    foreignKey: 'courseId',
  })
  declare course: BelongsTo<typeof AcademicCourseModel>

  @belongsTo(() => AcademicExamModel, {
    foreignKey: 'targetExamId',
  })
  declare targetExam: BelongsTo<typeof AcademicExamModel>

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

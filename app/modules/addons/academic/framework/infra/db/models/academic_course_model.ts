import { randomUUID } from 'node:crypto'
import { DateTime } from 'luxon'
import { BaseModel, beforeSave, belongsTo, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import { softDelete } from '#shared/framework/infra/db/adapters/soft_delete_adapter'
import { AcademicUniversityModel } from './academic_university_model.js'
import { AcademicUnitModel } from './academic_unit_model.js'
import { AcademicSubjectModel } from './academic_subject_model.js'
import { AcademicExamModel } from './academic_exam_model.js'

export class AcademicCourseModel extends BaseModel {
  static table = 'acad_courses'
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column({ columnName: 'university_id' })
  declare universityId: string

  @column({ columnName: 'academic_unit_id' })
  declare academicUnitId?: string | null

  @column()
  declare name: string

  @column()
  declare status: string

  @belongsTo(() => AcademicUniversityModel, {
    foreignKey: 'universityId',
  })
  declare university: BelongsTo<typeof AcademicUniversityModel>

  @belongsTo(() => AcademicUnitModel, {
    foreignKey: 'academicUnitId',
  })
  declare academicUnit: BelongsTo<typeof AcademicUnitModel>

  @manyToMany(() => AcademicSubjectModel, {
    pivotTable: 'acad_course_subjects',
    localKey: 'id',
    pivotForeignKey: 'course_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'subject_id',
  })
  declare subjects: ManyToMany<typeof AcademicSubjectModel>

  @hasMany(() => AcademicExamModel, {
    foreignKey: 'courseId',
  })
  declare exams: HasMany<typeof AcademicExamModel>

  @column.dateTime()
  declare deletedAt?: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeSave()
  static async setId(model: AcademicCourseModel) {
    model.id = model.id || randomUUID()
  }

  async softDelete() {
    await softDelete(this)
  }
}

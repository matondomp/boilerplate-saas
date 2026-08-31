import { randomUUID } from 'node:crypto'
import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import { softDelete } from '#shared/framework/infra/db/adapters/soft_delete_adapter'
import { AcademicTopicModel } from './academic_topic_model.js'
import { AcademicCourseModel } from './academic_course_model.js'

export class AcademicSubjectModel extends BaseModel {
  static table = 'acad_subjects'
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare description?: string | null

  @hasMany(() => AcademicTopicModel, {
    foreignKey: 'subjectId',
  })
  declare topics: HasMany<typeof AcademicTopicModel>

  @manyToMany(() => AcademicCourseModel, {
    pivotTable: 'acad_course_subjects',
    localKey: 'id',
    pivotForeignKey: 'subject_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'course_id',
  })
  declare courses: ManyToMany<typeof AcademicCourseModel>

  @column.dateTime()
  declare deletedAt?: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeSave()
  static async setId(model: AcademicSubjectModel) {
    model.id = model.id || randomUUID()
  }

  async softDelete() {
    await softDelete(this)
  }
}

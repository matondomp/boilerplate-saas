import { randomUUID } from 'node:crypto'
import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column } from '@adonisjs/lucid/orm'

export class AcademicCourseSubjectModel extends BaseModel {
  static table = 'acad_course_subjects'
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare courseId: string

  @column()
  declare subjectId: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeSave()
  static async setId(model: AcademicCourseSubjectModel) {
    model.id = model.id || randomUUID()
  }
}

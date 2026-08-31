import { Mapper, UniqueEntityID } from '#core/domain/index'
import { DateTime } from 'luxon'
import { PreparationGoalEntity } from '../../../../domain/entities/index.js'
import { PreparationGoalStatus } from '../../../../domain/value_objects/index.js'
import { StudentPreparationGoalModel } from '../models/index.js'

export class PreparationGoalMapper implements Mapper<PreparationGoalEntity, StudentPreparationGoalModel> {
  toDomain(model: StudentPreparationGoalModel): PreparationGoalEntity {
    return PreparationGoalEntity.hydrate(
      new UniqueEntityID(model.id),
      {
        studentId: new UniqueEntityID(model.studentId),
        universityId: new UniqueEntityID(model.universityId),
        courseId: new UniqueEntityID(model.courseId),
        targetExamId: model.targetExamId ? new UniqueEntityID(model.targetExamId) : null,
        targetYear: model.targetYear,
        targetExamPeriod: model.targetExamPeriod,
        targetDate: model.targetDate?.toJSDate() || null,
        status: model.status as PreparationGoalStatus,
        isPrimary: Boolean(model.isPrimary),
        startedAt: model.startedAt?.toJSDate() || null,
        completedAt: model.completedAt?.toJSDate() || null,
        createdAt: model.createdAt?.toJSDate(),
        updatedAt: model.updatedAt?.toJSDate(),
        deletedAt: model.deletedAt?.toJSDate() || null,
      }
    )
  }

  async toPersistence(entity: PreparationGoalEntity): Promise<StudentPreparationGoalModel> {
    let model = await StudentPreparationGoalModel.find(entity.id.toString())

    if (!model) {
      model = new StudentPreparationGoalModel()
      model.id = entity.id.toString()
    }

    model.studentId = entity.studentId.toString()
    model.universityId = entity.universityId.toString()
    model.courseId = entity.courseId.toString()
    model.targetExamId = entity.targetExamId ? entity.targetExamId.toString() : null
    model.targetYear = entity.targetYear
    model.targetExamPeriod = entity.targetExamPeriod || null
    model.targetDate = entity.targetDate ? DateTime.fromJSDate(entity.targetDate) : null
    model.status = entity.status
    model.isPrimary = entity.isPrimary
    model.startedAt = entity.startedAt ? DateTime.fromJSDate(entity.startedAt) : null
    model.completedAt = entity.completedAt ? DateTime.fromJSDate(entity.completedAt) : null

    return model
  }
}

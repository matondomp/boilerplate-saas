import { Mapper, UniqueEntityID } from '#core/domain/index'
import { DateAdapter } from '#shared/domain/ports/index'
import { DateAdapterImpl } from '#shared/framework/infra/adapters/date_adapter_impl'
import { PreparationGoalEntity } from '../../../../domain/entities/index.js'
import { PreparationGoalStatus } from '../../../../domain/value_objects/index.js'
import { StudentPreparationGoalModel } from '../models/index.js'

export class PreparationGoalMapper
  implements Mapper<PreparationGoalEntity, StudentPreparationGoalModel>
{
  constructor(private readonly dateAdapter: DateAdapter = new DateAdapterImpl()) {}

  toDomain(model: StudentPreparationGoalModel): PreparationGoalEntity {
    return PreparationGoalEntity.hydrate(
      new UniqueEntityID(model.id),
      {
        studentId: new UniqueEntityID(model.studentId),
        universityId: new UniqueEntityID(model.universityId),
        courseId: new UniqueEntityID(model.courseId),
        targetExamPeriod: model.targetExamPeriod,
        status: model.status as PreparationGoalStatus,
      },
      {
        createdAt: model.createdAt?.toJSDate(),
        updatedAt: model.updatedAt?.toJSDate(),
        deletedAt: model.deletedAt?.toJSDate(),
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
    model.targetExamPeriod = entity.targetExamPeriod || null
    model.status = entity.status
    model.deletedAt = this.dateAdapter.toDatePersistence(entity.deletedAt)

    return model
  }
}

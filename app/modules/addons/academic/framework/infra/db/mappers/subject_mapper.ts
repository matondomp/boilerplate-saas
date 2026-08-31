import { Mapper, UniqueEntityID } from '#core/domain/index'
import { DateAdapter } from '#shared/domain/ports/index'
import { DateAdapterImpl } from '#shared/framework/infra/adapters/date_adapter_impl'
import { SubjectEntity } from '../../../../domain/entities/index.js'
import { AcademicSubjectModel } from '../models/index.js'

export class SubjectMapper implements Mapper<SubjectEntity, AcademicSubjectModel> {
  constructor(private readonly dateAdapter: DateAdapter = new DateAdapterImpl()) {}

  toDomain(model: AcademicSubjectModel): SubjectEntity {
    return SubjectEntity.hydrate(
      new UniqueEntityID(model.id),
      {
        name: model.name,
        description: model.description,
      },
      {
        createdAt: model.createdAt?.toJSDate(),
        updatedAt: model.updatedAt?.toJSDate(),
        deletedAt: model.deletedAt?.toJSDate(),
      }
    )
  }

  async toPersistence(entity: SubjectEntity): Promise<AcademicSubjectModel> {
    let model = await AcademicSubjectModel.find(entity.id.toString())
    if (!model) {
      model = new AcademicSubjectModel()
      model.id = entity.id.toString()
    }

    model.name = entity.name
    model.description = entity.description || null
    model.deletedAt = this.dateAdapter.toDatePersistence(entity.deletedAt)

    return model
  }
}

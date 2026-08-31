import { Mapper, UniqueEntityID } from '#core/domain/index'
import { DateAdapter } from '#shared/domain/ports/index'
import { DateAdapterImpl } from '#shared/framework/infra/adapters/date_adapter_impl'
import { TopicEntity } from '../../../../domain/entities/index.js'
import { AcademicTopicModel } from '../models/index.js'

export class TopicMapper implements Mapper<TopicEntity, AcademicTopicModel> {
  constructor(private readonly dateAdapter: DateAdapter = new DateAdapterImpl()) {}

  toDomain(model: AcademicTopicModel): TopicEntity {
    return TopicEntity.hydrate(
      new UniqueEntityID(model.id),
      {
        subjectId: new UniqueEntityID(model.subjectId),
        parentId: model.parentId ? new UniqueEntityID(model.parentId) : null,
        name: model.name,
        level: model.level,
        position: model.position,
      },
      {
        createdAt: model.createdAt?.toJSDate(),
        updatedAt: model.updatedAt?.toJSDate(),
        deletedAt: model.deletedAt?.toJSDate(),
      }
    )
  }

  async toPersistence(entity: TopicEntity): Promise<AcademicTopicModel> {
    let model = await AcademicTopicModel.find(entity.id.toString())
    if (!model) {
      model = new AcademicTopicModel()
      model.id = entity.id.toString()
    }

    model.subjectId = entity.subjectId.toString()
    model.parentId = entity.parentId ? entity.parentId.toString() : null
    model.name = entity.name
    model.level = entity.level
    model.position = entity.position
    model.deletedAt = this.dateAdapter.toDatePersistence(entity.deletedAt)

    return model
  }
}

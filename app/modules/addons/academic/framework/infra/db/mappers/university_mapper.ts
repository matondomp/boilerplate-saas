import { Mapper, UniqueEntityID } from '#core/domain/index'
import { DateAdapter } from '#shared/domain/ports/index'
import { DateAdapterImpl } from '#shared/framework/infra/adapters/date_adapter_impl'
import { UniversityEntity } from '../../../../domain/entities/index.js'
import { UniversityStatus } from '../../../../domain/value_objects/index.js'
import { AcademicUniversityModel } from '../models/index.js'

export class UniversityMapper implements Mapper<UniversityEntity, AcademicUniversityModel> {
  constructor(private readonly dateAdapter: DateAdapter = new DateAdapterImpl()) {}

  toDomain(model: AcademicUniversityModel): UniversityEntity {
    return UniversityEntity.hydrate(
      new UniqueEntityID(model.id),
      {
        name: model.name,
        acronym: model.acronym,
        status: model.status as UniversityStatus,
      },
      {
        createdAt: model.createdAt?.toJSDate(),
        updatedAt: model.updatedAt?.toJSDate(),
        deletedAt: model.deletedAt?.toJSDate(),
      }
    )
  }

  async toPersistence(entity: UniversityEntity): Promise<AcademicUniversityModel> {
    let model = await AcademicUniversityModel.find(entity.id.toString())
    if (!model) {
      model = new AcademicUniversityModel()
      model.id = entity.id.toString()
    }

    model.name = entity.name
    model.acronym = entity.acronym
    model.status = entity.status
    model.deletedAt = this.dateAdapter.toDatePersistence(entity.deletedAt)

    return model
  }
}

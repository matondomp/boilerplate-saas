import { Mapper, UniqueEntityID } from '#core/domain/index'
import { DateAdapter } from '#shared/domain/ports/index'
import { DateAdapterImpl } from '#shared/framework/infra/adapters/date_adapter_impl'
import { CourseEntity } from '../../../../domain/entities/index.js'
import { CourseStatus } from '../../../../domain/value_objects/index.js'
import { AcademicCourseModel } from '../models/index.js'

export class CourseMapper implements Mapper<CourseEntity, AcademicCourseModel> {
  constructor(private readonly dateAdapter: DateAdapter = new DateAdapterImpl()) {}

  toDomain(model: AcademicCourseModel): CourseEntity {
    return CourseEntity.hydrate(
      new UniqueEntityID(model.id),
      {
        universityId: new UniqueEntityID(model.universityId),
        academicUnitId: model.academicUnitId ? new UniqueEntityID(model.academicUnitId) : null,
        name: model.name,
        status: model.status as CourseStatus,
      },
      {
        createdAt: model.createdAt?.toJSDate(),
        updatedAt: model.updatedAt?.toJSDate(),
        deletedAt: model.deletedAt?.toJSDate(),
      }
    )
  }

  async toPersistence(entity: CourseEntity): Promise<AcademicCourseModel> {
    let model = await AcademicCourseModel.find(entity.id.toString())
    if (!model) {
      model = new AcademicCourseModel()
      model.id = entity.id.toString()
    }

    model.universityId = entity.universityId.toString()
    model.academicUnitId = entity.academicUnitId ? entity.academicUnitId.toString() : null
    model.name = entity.name
    model.status = entity.status
    model.deletedAt = this.dateAdapter.toDatePersistence(entity.deletedAt)

    return model
  }
}

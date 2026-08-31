import { Mapper, UniqueEntityID } from '#core/domain/index'
import { DateAdapter } from '#shared/domain/ports/index'
import { DateAdapterImpl } from '#shared/framework/infra/adapters/date_adapter_impl'
import { ExamEntity } from '../../../../domain/entities/index.js'
import { ContentSource, SourceMetadata } from '../../../../domain/value_objects/index.js'
import { AcademicExamModel } from '../models/index.js'

export class ExamMapper implements Mapper<ExamEntity, AcademicExamModel> {
  constructor(private readonly dateAdapter: DateAdapter = new DateAdapterImpl()) {}

  toDomain(model: AcademicExamModel): ExamEntity {
    return ExamEntity.hydrate(
      new UniqueEntityID(model.id),
      {
        courseId: new UniqueEntityID(model.courseId),
        year: model.year,
        period: model.period,
        sourceType: model.sourceType as ContentSource,
        sourceMetadata: model.sourceMetadata as SourceMetadata,
        documentUrl: model.documentUrl,
        status: model.status,
      },
      {
        createdAt: model.createdAt?.toJSDate(),
        updatedAt: model.updatedAt?.toJSDate(),
        deletedAt: model.deletedAt?.toJSDate(),
      }
    )
  }

  async toPersistence(entity: ExamEntity): Promise<AcademicExamModel> {
    let model = await AcademicExamModel.find(entity.id.toString())
    if (!model) {
      model = new AcademicExamModel()
      model.id = entity.id.toString()
    }

    model.courseId = entity.courseId.toString()
    model.year = entity.year
    model.period = entity.period
    model.sourceType = entity.sourceType
    model.sourceMetadata = (entity.sourceMetadata as any) || null
    model.documentUrl = entity.documentUrl || null
    model.status = entity.status
    model.deletedAt = this.dateAdapter.toDatePersistence(entity.deletedAt)

    return model
  }
}

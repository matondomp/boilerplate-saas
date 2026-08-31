import { Mapper, UniqueEntityID } from '#core/domain/index'
import { DateAdapter } from '#shared/domain/ports/index'
import { DateAdapterImpl } from '#shared/framework/infra/adapters/date_adapter_impl'
import { QuestionEntity, QuestionOptionEntity } from '../../../../domain/entities/index.js'
import {
  ContentSource,
  DifficultyLevel,
  QuestionStatus,
  QuestionType,
  SourceMetadata,
} from '../../../../domain/value_objects/index.js'
import { AcademicQuestionModel } from '../models/index.js'

export class QuestionMapper implements Mapper<QuestionEntity, AcademicQuestionModel> {
  constructor(private readonly dateAdapter: DateAdapter = new DateAdapterImpl()) {}

  toDomain(model: AcademicQuestionModel): QuestionEntity {
    const options = (model.options || []).map((opt) =>
      QuestionOptionEntity.hydrate(
        new UniqueEntityID(opt.id),
        {
          questionId: new UniqueEntityID(opt.questionId),
          label: opt.label,
          content: opt.content,
          position: opt.position,
          isCorrect: Boolean(opt.isCorrect),
        },
        {
          createdAt: opt.createdAt?.toJSDate(),
          updatedAt: opt.updatedAt?.toJSDate(),
        }
      )
    )

    return QuestionEntity.hydrate(
      new UniqueEntityID(model.id),
      {
        examId: model.examId ? new UniqueEntityID(model.examId) : null,
        subjectId: new UniqueEntityID(model.subjectId),
        topicId: new UniqueEntityID(model.topicId),
        type: model.type as QuestionType,
        statement: model.statement,
        difficulty: model.difficulty as DifficultyLevel,
        solution: model.solution,
        explanation: model.explanation,
        source: model.source as ContentSource,
        sourceMetadata: model.sourceMetadata as SourceMetadata,
        status: model.status as QuestionStatus,
        version: model.version,
        options,
      },
      {
        createdAt: model.createdAt?.toJSDate(),
        updatedAt: model.updatedAt?.toJSDate(),
        deletedAt: model.deletedAt?.toJSDate(),
      }
    )
  }

  async toPersistence(entity: QuestionEntity): Promise<AcademicQuestionModel> {
    let model = await AcademicQuestionModel.find(entity.id.toString())
    if (!model) {
      model = new AcademicQuestionModel()
      model.id = entity.id.toString()
    }

    model.examId = entity.examId ? entity.examId.toString() : null
    model.subjectId = entity.subjectId.toString()
    model.topicId = entity.topicId.toString()
    model.type = entity.type
    model.statement = entity.statement
    model.difficulty = entity.difficulty
    model.solution = entity.solution || null
    model.explanation = entity.explanation || null
    model.source = entity.source
    model.sourceMetadata = (entity.sourceMetadata as any) || null
    model.status = entity.status
    model.version = entity.version
    model.deletedAt = this.dateAdapter.toDatePersistence(entity.deletedAt)

    return model
  }
}

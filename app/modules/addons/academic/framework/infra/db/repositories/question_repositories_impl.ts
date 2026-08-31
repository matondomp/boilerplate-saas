import { TransactionClientContract } from '@adonisjs/lucid/types/database'
import {
  QuestionEntity,
  QuestionRevisionEntity,
  SubjectEntity,
  TopicEntity,
} from '../../../../domain/entities/index.js'
import {
  CreateQuestionWithTransactionRepository,
  FindSubjectByIdRepository,
  FindTopicByIdRepository,
} from '../../../../usecases/create_question/ports/index.js'
import {
  FindQuestionByIdRepository,
  UpdateQuestionWithTransactionRepository,
} from '../../../../usecases/update_question/ports/index.js'
import { UpdateQuestionStatusRepository } from '../../../../usecases/change_question_status/ports/index.js'
import {
  AcademicQuestionModel,
  AcademicSubjectModel,
  AcademicTopicModel,
} from '../models/index.js'
import { QuestionMapper, SubjectMapper, TopicMapper } from '../mappers/index.js'

export class QuestionRepositoriesImpl
  implements
    FindSubjectByIdRepository,
    FindTopicByIdRepository,
    CreateQuestionWithTransactionRepository<TransactionClientContract>,
    FindQuestionByIdRepository,
    UpdateQuestionWithTransactionRepository<TransactionClientContract>,
    UpdateQuestionStatusRepository
{
  constructor(
    private readonly questionMapper: QuestionMapper = new QuestionMapper(),
    private readonly subjectMapper: SubjectMapper = new SubjectMapper(),
    private readonly topicMapper: TopicMapper = new TopicMapper()
  ) {}

  async findById(id: string): Promise<QuestionEntity | null> {
    const model = await AcademicQuestionModel.query()
      .preload('options')
      .where('id', id)
      .andWhereNull('deleted_at')
      .first()

    if (!model) return null
    return this.questionMapper.toDomain(model)
  }

  async findSubjectById(id: string): Promise<SubjectEntity | null> {
    const model = await AcademicSubjectModel.query()
      .where('id', id)
      .andWhereNull('deleted_at')
      .first()

    if (!model) return null
    return this.subjectMapper.toDomain(model)
  }

  async findTopicById(id: string): Promise<TopicEntity | null> {
    const model = await AcademicTopicModel.query()
      .where('id', id)
      .andWhereNull('deleted_at')
      .first()

    if (!model) return null
    return this.topicMapper.toDomain(model)
  }

  async createWithTransaction(
    question: QuestionEntity,
    trx: TransactionClientContract
  ): Promise<void> {
    const model = await this.questionMapper.toPersistence(question)
    if (trx && typeof (trx as any).once === 'function') {
      model.useTransaction(trx)
    }
    await model.save()

    if (question.options.length > 0) {
      const optionsRows = question.options.map((opt) => ({
        id: opt.id.toString(),
        question_id: question.id.toString(),
        label: opt.label,
        content: opt.content,
        position: opt.position,
        is_correct: opt.isCorrect,
        created_at: new Date(),
        updated_at: new Date(),
      }))

      await trx.table('eval_question_options').insert(optionsRows)
    }
  }

  async updateWithTransaction(
    question: QuestionEntity,
    revision: QuestionRevisionEntity | null,
    trx: TransactionClientContract
  ): Promise<void> {
    const model = await this.questionMapper.toPersistence(question)
    if (trx && typeof (trx as any).once === 'function') {
      model.useTransaction(trx)
    }
    await model.save()

    // Atualiza opções: remove existentes e insere novas se fornecidas
    if (question.options.length > 0) {
      await trx.from('eval_question_options').where('question_id', question.id.toString()).delete()

      const optionsRows = question.options.map((opt) => ({
        id: opt.id.toString(),
        question_id: question.id.toString(),
        label: opt.label,
        content: opt.content,
        position: opt.position,
        is_correct: opt.isCorrect,
        created_at: new Date(),
        updated_at: new Date(),
      }))

      await trx.table('eval_question_options').insert(optionsRows)
    }

    if (revision) {
      await trx.table('eval_question_revisions').insert({
        id: revision.id.toString(),
        question_id: revision.questionId.toString(),
        revision_number: revision.revisionNumber,
        author_id: revision.authorId.toString(),
        changes_summary: revision.changesSummary,
        snapshot_data: JSON.stringify(revision.snapshotData),
        reason: revision.reason,
        created_at: new Date(),
      })
    }
  }

  async updateStatus(question: QuestionEntity): Promise<void> {
    const model = await this.questionMapper.toPersistence(question)
    await model.save()
  }
}

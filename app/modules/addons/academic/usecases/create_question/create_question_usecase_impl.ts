import { Either, left, right, UniqueEntityID } from '#core/domain/index'
import { TransactionAdapter } from '#core/ports/index'
import {
  CreateQuestionUseCase,
  CreateQuestionUseCaseInput,
  DifficultyLevel,
  QuestionEntity,
  QuestionOptionEntity,
  QuestionType,
  SubjectNotFoundError,
  TopicNotFoundError,
} from '../../domain/index.js'
import {
  CreateQuestionWithTransactionRepository,
  FindSubjectByIdRepository,
  FindTopicByIdRepository,
} from './ports/index.js'

export class CreateQuestionUseCaseImpl implements CreateQuestionUseCase {
  constructor(
    private readonly findSubjectByIdRepository: FindSubjectByIdRepository,
    private readonly findTopicByIdRepository: FindTopicByIdRepository,
    private readonly createQuestionWithTransactionRepository: CreateQuestionWithTransactionRepository,
    private readonly transactionAdapter: TransactionAdapter
  ) {}

  async perform(input: CreateQuestionUseCaseInput): Promise<Either<any, { id: string }>> {
    const subject = await this.findSubjectByIdRepository.findById(input.subjectId)
    if (!subject) {
      return left(new SubjectNotFoundError())
    }

    const topic = await this.findTopicByIdRepository.findById(input.topicId)
    if (!topic) {
      return left(new TopicNotFoundError())
    }

    const options = (input.options || []).map(
      (opt) =>
        QuestionOptionEntity.create({
          label: opt.label,
          content: opt.content,
          position: opt.position,
          isCorrect: opt.isCorrect,
        }).value as QuestionOptionEntity
    )

    const questionOrError = QuestionEntity.create({
      examId: input.examId ? new UniqueEntityID(input.examId) : null,
      subjectId: new UniqueEntityID(input.subjectId),
      topicId: new UniqueEntityID(input.topicId),
      type: input.type || QuestionType.SINGLE_CHOICE,
      statement: input.statement,
      difficulty: input.difficulty || DifficultyLevel.MEDIUM,
      solution: input.solution,
      explanation: input.explanation,
      source: input.source as any,
      sourceMetadata: input.sourceMetadata,
      options,
    })

    if (questionOrError.isLeft()) {
      return left(questionOrError.value)
    }

    const question = questionOrError.value

    // Assegura que as opções recebam o ID da questão
    question.options.forEach((opt) => opt.setQuestionId(question.id))

    await this.transactionAdapter.useTransaction(async (trx) => {
      await this.createQuestionWithTransactionRepository.createWithTransaction(question, trx)
    })

    return right({ id: question.id.toString() })
  }
}

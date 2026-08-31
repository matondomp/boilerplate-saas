import { Either, IEventDispatcher, left, right, UniqueEntityID } from '#core/domain/index'
import { TransactionAdapter } from '#core/ports/index'
import {
  QuestionNotFoundError,
  QuestionOptimisticLockConflictError,
  QuestionOptionEntity,
  QuestionRevisionCreatedEvent,
  QuestionRevisionEntity,
  UpdateQuestionUseCase,
  UpdateQuestionUseCaseInput,
} from '../../domain/index.js'
import {
  FindQuestionByIdRepository,
  UpdateQuestionWithTransactionRepository,
} from './ports/index.js'

export class UpdateQuestionUseCaseImpl implements UpdateQuestionUseCase {
  constructor(
    private readonly findQuestionByIdRepository: FindQuestionByIdRepository,
    private readonly updateQuestionWithTransactionRepository: UpdateQuestionWithTransactionRepository,
    private readonly transactionAdapter: TransactionAdapter,
    private readonly eventDispatcher: IEventDispatcher
  ) {}

  async perform(input: UpdateQuestionUseCaseInput): Promise<Either<any, boolean>> {
    const question = await this.findQuestionByIdRepository.findById(input.id)
    if (!question) {
      return left(new QuestionNotFoundError())
    }

    // Validação de Concorrência Otimista (Optimistic Lock)
    if (question.version !== input.version) {
      return left(new QuestionOptimisticLockConflictError())
    }

    let revision: QuestionRevisionEntity | null = null

    // Se a questão já estiver PUBLISHED, cria uma nova revisão antes de mutar
    if (question.isPublished) {
      const snapshot = {
        statement: question.statement,
        solution: question.solution,
        explanation: question.explanation,
        difficulty: question.difficulty,
        version: question.version,
        options: question.options.map((o) => ({
          label: o.label,
          content: o.content,
          isCorrect: o.isCorrect,
          position: o.position,
        })),
      }

      const revisionOrError = QuestionRevisionEntity.create({
        questionId: question.id,
        revisionNumber: question.version,
        authorId: new UniqueEntityID(input.authorId),
        changesSummary: `Edição em questão publicada. Motivo: ${input.reason}`,
        snapshotData: snapshot,
        reason: input.reason,
      })

      if (revisionOrError.isLeft()) {
        return left(revisionOrError.value)
      }

      revision = revisionOrError.value
    }

    // Aplica alterações
    if (input.statement) question.changeStatement(input.statement)
    if (input.solution !== undefined) question.changeSolution(input.solution)
    if (input.explanation !== undefined) question.changeExplanation(input.explanation)
    if (input.difficulty) question.changeDifficulty(input.difficulty)
    if (input.topicId) question.changeTopic(new UniqueEntityID(input.topicId))

    if (input.options && input.options.length > 0) {
      const newOptions = input.options.map((opt) => {
        const option = QuestionOptionEntity.create({
          label: opt.label,
          content: opt.content,
          position: opt.position,
          isCorrect: opt.isCorrect,
        }).value as QuestionOptionEntity
        option.setQuestionId(question.id)
        return option
      })
      question.setOptions(newOptions)
    }

    // Incrementa versão
    question.incrementVersion()

    const validation = question.validate()
    if (validation.isLeft()) {
      return left(validation.value)
    }

    await this.transactionAdapter.useTransaction(async (trx) => {
      await this.updateQuestionWithTransactionRepository.updateWithTransaction(
        question,
        revision,
        trx
      )
    })

    if (revision) {
      await this.eventDispatcher.publish(
        new QuestionRevisionCreatedEvent({
          questionId: question.id,
          revisionNumber: revision.revisionNumber,
          authorId: revision.authorId,
          reason: revision.reason,
        })
      )
    }

    return right(true)
  }
}

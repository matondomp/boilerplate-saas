import { Either, IEventDispatcher, left, right, UniqueEntityID } from '#core/domain/index'
import {
  ChangeQuestionStatusUseCase,
  ChangeQuestionStatusUseCaseInput,
  QuestionNotFoundError,
  QuestionStatusChangedEvent,
} from '../../domain/index.js'
import {
  FindQuestionByIdRepository,
  UpdateQuestionStatusRepository,
} from './ports/index.js'

export class ChangeQuestionStatusUseCaseImpl implements ChangeQuestionStatusUseCase {
  constructor(
    private readonly findQuestionByIdRepository: FindQuestionByIdRepository,
    private readonly updateQuestionStatusRepository: UpdateQuestionStatusRepository,
    private readonly eventDispatcher: IEventDispatcher
  ) {}

  async perform(input: ChangeQuestionStatusUseCaseInput): Promise<Either<any, boolean>> {
    const question = await this.findQuestionByIdRepository.findById(input.id)
    if (!question) {
      return left(new QuestionNotFoundError())
    }

    const previousStatus = question.status
    const transitionOrError = question.changeStatus(input.newStatus)
    if (transitionOrError.isLeft()) {
      return left(transitionOrError.value)
    }

    await this.updateQuestionStatusRepository.updateStatus(question)

    await this.eventDispatcher.publish(
      new QuestionStatusChangedEvent({
        questionId: question.id,
        previousStatus,
        newStatus: input.newStatus,
        authorId: input.authorId ? new UniqueEntityID(input.authorId) : undefined,
      })
    )

    return right(true)
  }
}

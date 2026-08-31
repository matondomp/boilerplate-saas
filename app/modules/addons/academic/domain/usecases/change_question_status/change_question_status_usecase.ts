import { Either, UseCase } from '#core/domain/index'
import {
  QuestionInvalidStateTransitionError,
  QuestionNotFoundError,
} from '../../errors/index.js'
import { QuestionStatus } from '../../value_objects/index.js'

export interface ChangeQuestionStatusUseCaseInput {
  id: string
  newStatus: QuestionStatus
  authorId: string
  reason?: string
}

type Errors = QuestionNotFoundError | QuestionInvalidStateTransitionError

export type ChangeQuestionStatusUseCase = UseCase<
  ChangeQuestionStatusUseCaseInput,
  Either<Errors, boolean>
>

import { Either, UseCase } from '#core/domain/index'
import {
  QuestionNotFoundError,
  QuestionOptimisticLockConflictError,
  QuestionStatementRequiredError,
} from '../../errors/index.js'
import { DifficultyLevel } from '../../value_objects/index.js'
import { CreateQuestionOptionInput } from '../create_question/create_question_usecase.js'

export interface UpdateQuestionUseCaseInput {
  id: string
  statement?: string
  solution?: string | null
  explanation?: string | null
  difficulty?: DifficultyLevel
  topicId?: string
  options?: CreateQuestionOptionInput[]
  version: number
  authorId: string
  reason: string
}

type Errors =
  | QuestionNotFoundError
  | QuestionOptimisticLockConflictError
  | QuestionStatementRequiredError

export type UpdateQuestionUseCase = UseCase<
  UpdateQuestionUseCaseInput,
  Either<Errors, boolean>
>

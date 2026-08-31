import { Either, UseCase } from '#core/domain/index'
import { QuestionNotFoundError } from '../../errors/index.js'
import { QuestionRelationType } from '../../value_objects/index.js'

export interface RelateQuestionsUseCaseInput {
  sourceQuestionId: string
  targetQuestionId: string
  relationType: QuestionRelationType
}

type Errors = QuestionNotFoundError

export type RelateQuestionsUseCase = UseCase<
  RelateQuestionsUseCaseInput,
  Either<Errors, { id: string }>
>

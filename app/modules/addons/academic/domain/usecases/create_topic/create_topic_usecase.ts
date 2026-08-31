import { Either, UseCase } from '#core/domain/index'
import {
  SubjectNotFoundError,
  TopicHierarchyCycleError,
  TopicNameRequiredError,
  TopicNotFoundError,
  TopicSubjectRequiredError,
} from '../../errors/index.js'

export interface CreateTopicUseCaseInput {
  subjectId: string
  parentId?: string | null
  name: string
  position?: number
}

type Errors =
  | SubjectNotFoundError
  | TopicNotFoundError
  | TopicHierarchyCycleError
  | TopicNameRequiredError
  | TopicSubjectRequiredError

export type CreateTopicUseCase = UseCase<
  CreateTopicUseCaseInput,
  Either<Errors, { id: string }>
>

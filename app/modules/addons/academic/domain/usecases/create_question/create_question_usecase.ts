import { Either, UseCase } from '#core/domain/index'
import {
  QuestionInvalidOptionCountError,
  QuestionSingleChoiceMustHaveOneCorrectOptionError,
  QuestionStatementRequiredError,
  QuestionSubjectRequiredError,
  QuestionTopicRequiredError,
  SubjectNotFoundError,
  TopicNotFoundError,
} from '../../errors/index.js'
import {
  ContentSource,
  DifficultyLevel,
  QuestionType,
  SourceMetadata,
} from '../../value_objects/index.js'

export interface CreateQuestionOptionInput {
  label: string
  content: string
  position: number
  isCorrect: boolean
}

export interface CreateQuestionUseCaseInput {
  examId?: string | null
  subjectId: string
  topicId: string
  type?: QuestionType
  statement: string
  difficulty?: DifficultyLevel
  solution?: string | null
  explanation?: string | null
  source?: ContentSource
  sourceMetadata?: SourceMetadata | null
  options?: CreateQuestionOptionInput[]
}

type Errors =
  | SubjectNotFoundError
  | TopicNotFoundError
  | QuestionStatementRequiredError
  | QuestionSubjectRequiredError
  | QuestionTopicRequiredError
  | QuestionInvalidOptionCountError
  | QuestionSingleChoiceMustHaveOneCorrectOptionError

export type CreateQuestionUseCase = UseCase<
  CreateQuestionUseCaseInput,
  Either<Errors, { id: string }>
>

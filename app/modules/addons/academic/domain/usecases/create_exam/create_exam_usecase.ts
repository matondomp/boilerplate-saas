import { Either, UseCase } from '#core/domain/index'
import {
  CourseNotFoundError,
  ExamAlreadyExistsError,
  ExamCourseRequiredError,
  ExamPeriodRequiredError,
  ExamYearRequiredError,
} from '../../errors/index.js'
import { ContentSource, SourceMetadata } from '../../value_objects/index.js'

export interface CreateExamUseCaseInput {
  courseId: string
  year: number
  period: string
  sourceType?: ContentSource
  sourceMetadata?: SourceMetadata | null
  documentUrl?: string | null
}

type Errors =
  | CourseNotFoundError
  | ExamAlreadyExistsError
  | ExamCourseRequiredError
  | ExamYearRequiredError
  | ExamPeriodRequiredError

export type CreateExamUseCase = UseCase<
  CreateExamUseCaseInput,
  Either<Errors, { id: string }>
>

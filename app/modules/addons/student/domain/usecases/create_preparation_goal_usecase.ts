import { Either, UseCase } from '#core/domain/index'
import {
  CourseDoesNotBelongToUniversityError,
  CourseInactiveError,
  CourseNotFoundError,
  PreparationGoalAlreadyExistsError,
  PreparationGoalCourseRequiredError,
  PreparationGoalStudentRequiredError,
  PreparationGoalUniversityRequiredError,
  StudentInactiveError,
  StudentNotFoundError,
  StudentSuspendedError,
  UniversityInactiveError,
  UniversityNotFoundError,
} from '../errors/index.js'

export interface CreatePreparationGoalInput {
  userId: string
  universityId: string
  courseId: string
  targetYear: number
  targetExamId?: string | null
  targetExamPeriod?: string | null
  targetDate?: Date | null
  isPrimary?: boolean
}

type Errors =
  | PreparationGoalStudentRequiredError
  | PreparationGoalUniversityRequiredError
  | PreparationGoalCourseRequiredError
  | PreparationGoalAlreadyExistsError
  | UniversityNotFoundError
  | UniversityInactiveError
  | CourseNotFoundError
  | CourseInactiveError
  | CourseDoesNotBelongToUniversityError
  | StudentNotFoundError
  | StudentInactiveError
  | StudentSuspendedError

export type CreatePreparationGoalUseCase = UseCase<
  CreatePreparationGoalInput,
  Either<Errors, { id: string }>
>

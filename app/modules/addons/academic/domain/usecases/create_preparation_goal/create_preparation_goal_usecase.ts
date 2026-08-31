import { Either, UseCase } from '#core/domain/index'
import {
  CourseInactiveError,
  CourseNotFoundError,
  PreparationGoalAlreadyExistsError,
  PreparationGoalCourseRequiredError,
  PreparationGoalStudentRequiredError,
  PreparationGoalUniversityRequiredError,
  UniversityInactiveError,
  UniversityNotFoundError,
} from '../../errors/index.js'

export interface CreatePreparationGoalUseCaseInput {
  studentId: string
  universityId: string
  courseId: string
  targetExamPeriod?: string | null
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

export type CreatePreparationGoalUseCase = UseCase<
  CreatePreparationGoalUseCaseInput,
  Either<Errors, { id: string }>
>

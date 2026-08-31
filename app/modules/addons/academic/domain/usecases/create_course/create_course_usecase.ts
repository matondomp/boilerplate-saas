import { Either, UseCase } from '#core/domain/index'
import {
  CourseAlreadyExistsError,
  CourseNameRequiredError,
  CourseUniversityRequiredError,
  UniversityNotFoundError,
} from '../../errors/index.js'

export interface CreateCourseUseCaseInput {
  universityId: string
  academicUnitId?: string | null
  name: string
}

type Errors =
  | CourseAlreadyExistsError
  | CourseNameRequiredError
  | CourseUniversityRequiredError
  | UniversityNotFoundError

export type CreateCourseUseCase = UseCase<
  CreateCourseUseCaseInput,
  Either<Errors, { id: string }>
>

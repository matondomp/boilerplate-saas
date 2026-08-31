import { Either, UseCase } from '#core/domain/index'
import {
  UniversityAlreadyExistsError,
  UniversityNameRequiredError,
  UniversityNotFoundError,
} from '../../errors/index.js'
import { UniversityStatus } from '../../value_objects/index.js'

export interface UpdateUniversityUseCaseInput {
  id: string
  name?: string
  acronym?: string
  status?: UniversityStatus
}

type Errors =
  | UniversityNotFoundError
  | UniversityAlreadyExistsError
  | UniversityNameRequiredError

export type UpdateUniversityUseCase = UseCase<
  UpdateUniversityUseCaseInput,
  Either<Errors, boolean>
>

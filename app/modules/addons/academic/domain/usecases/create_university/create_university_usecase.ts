import { Either, UseCase } from '#core/domain/index'
import {
  UniversityAcronymRequiredError,
  UniversityAlreadyExistsError,
  UniversityNameRequiredError,
} from '../../errors/index.js'

export interface CreateUniversityUseCaseInput {
  name: string
  acronym: string
}

type Errors =
  | UniversityAlreadyExistsError
  | UniversityNameRequiredError
  | UniversityAcronymRequiredError

export type CreateUniversityUseCase = UseCase<
  CreateUniversityUseCaseInput,
  Either<Errors, { id: string }>
>

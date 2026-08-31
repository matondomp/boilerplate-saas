import { Either, UseCase } from '#core/domain/index'
import { SubjectAlreadyExistsError, SubjectNameRequiredError } from '../../errors/index.js'

export interface CreateSubjectUseCaseInput {
  name: string
  description?: string | null
}

type Errors = SubjectAlreadyExistsError | SubjectNameRequiredError

export type CreateSubjectUseCase = UseCase<
  CreateSubjectUseCaseInput,
  Either<Errors, { id: string }>
>

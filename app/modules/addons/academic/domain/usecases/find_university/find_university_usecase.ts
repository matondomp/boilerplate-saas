import { Either, UseCase } from '#core/domain/index'
import { UniversityNotFoundError } from '../../errors/index.js'
import { UniversityEntity } from '../../entities/index.js'

export interface FindUniversityUseCaseInput {
  id: string
}

export type FindUniversityUseCase = UseCase<
  FindUniversityUseCaseInput,
  Either<UniversityNotFoundError, UniversityEntity>
>

import { Either, UseCase } from '#core/domain/index'
import { Paginate, Pagination } from '#core/ports/index'
import { UniversityEntity } from '../../entities/index.js'

export type ListUniversitiesUseCaseInput = Paginate

export type ListUniversitiesUseCase = UseCase<
  ListUniversitiesUseCaseInput,
  Either<never, Pagination<UniversityEntity>>
>

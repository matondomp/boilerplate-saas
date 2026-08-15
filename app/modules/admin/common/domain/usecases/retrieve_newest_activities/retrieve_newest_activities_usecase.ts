import { Either, UseCase } from '#core/domain/index'
import { RetrieveNewestActivitiesUseCaseInput } from './retrieve_newest_activities_usecase_input.js'
import { RetrieveNewestActivitiesUseCaseOutput } from './retrieve_newest_activities_usecase_output.js'
import { UserNotFoundError } from '#shared/domain/errors/index'

export type RetrieveNewestActivitiesUseCase = UseCase<
  RetrieveNewestActivitiesUseCaseInput,
  Either<UserNotFoundError, RetrieveNewestActivitiesUseCaseOutput[]>
>

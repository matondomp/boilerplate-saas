import { Either, UseCase } from '#core/domain/index'
import { PreparationGoalEntity } from '../entities/index.js'
import { PreparationGoalNotFoundError, StudentNotFoundError } from '../errors/index.js'

export interface GetPreparationGoalInput {
  userId: string
  goalId: string
}

export type GetPreparationGoalUseCase = UseCase<
  GetPreparationGoalInput,
  Either<PreparationGoalNotFoundError | StudentNotFoundError, PreparationGoalEntity>
>

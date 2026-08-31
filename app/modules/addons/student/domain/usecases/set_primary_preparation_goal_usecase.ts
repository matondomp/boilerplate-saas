import { Either, UseCase } from '#core/domain/index'
import { PreparationGoalNotFoundError, StudentNotFoundError } from '../errors/index.js'

export interface SetPrimaryPreparationGoalInput {
  userId: string
  goalId: string
}

export type SetPrimaryPreparationGoalUseCase = UseCase<
  SetPrimaryPreparationGoalInput,
  Either<PreparationGoalNotFoundError | StudentNotFoundError, boolean>
>

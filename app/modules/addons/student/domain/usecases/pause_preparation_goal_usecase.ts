import { Either, UseCase } from '#core/domain/index'
import { InvalidGoalStatusTransitionError, PreparationGoalNotFoundError, StudentNotFoundError } from '../errors/index.js'

export interface PausePreparationGoalInput {
  userId: string
  goalId: string
}

export type PausePreparationGoalUseCase = UseCase<
  PausePreparationGoalInput,
  Either<PreparationGoalNotFoundError | StudentNotFoundError | InvalidGoalStatusTransitionError, boolean>
>

import { Either, UseCase } from '#core/domain/index'
import { PreparationGoalEntity } from '../../entities/index.js'

export interface ListStudentGoalsUseCaseInput {
  studentId: string
}

export type ListStudentGoalsUseCase = UseCase<
  ListStudentGoalsUseCaseInput,
  Either<never, PreparationGoalEntity[]>
>

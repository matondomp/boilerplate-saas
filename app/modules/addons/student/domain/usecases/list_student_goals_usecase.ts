import { Either, UseCase } from '#core/domain/index'
import { PreparationGoalEntity } from '../entities/index.js'
import { StudentNotFoundError } from '../errors/index.js'

export interface ListStudentGoalsInput {
  userId: string
}

export type ListStudentGoalsUseCase = UseCase<
  ListStudentGoalsInput,
  Either<StudentNotFoundError, PreparationGoalEntity[]>
>

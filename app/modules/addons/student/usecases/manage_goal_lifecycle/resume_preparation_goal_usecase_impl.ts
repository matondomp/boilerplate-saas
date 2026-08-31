import { Either, left, right } from '#core/domain/index'
import { PreparationGoalNotFoundError, StudentNotFoundError } from '../../domain/index.js'
import { FindPreparationGoalByIdRepository, FindStudentByUserIdRepository, UpdatePreparationGoalRepository } from './ports/index.js'

export interface ResumePreparationGoalInput {
  userId: string
  goalId: string
}

export class ResumePreparationGoalUseCaseImpl {
  constructor(
    private readonly findStudentByUserIdRepository: FindStudentByUserIdRepository,
    private readonly findPreparationGoalByIdRepository: FindPreparationGoalByIdRepository,
    private readonly updatePreparationGoalRepository: UpdatePreparationGoalRepository
  ) {}

  async perform(input: ResumePreparationGoalInput): Promise<Either<any, boolean>> {
    const student = await this.findStudentByUserIdRepository.findByUserId(input.userId)
    if (!student) return left(new StudentNotFoundError())

    const goal = await this.findPreparationGoalByIdRepository.findById(input.goalId)
    if (!goal || goal.studentId.toString() !== student.id.toString()) {
      return left(new PreparationGoalNotFoundError())
    }

    const transitionResult = goal.resume()
    if (transitionResult.isLeft()) return left(transitionResult.value)

    await this.updatePreparationGoalRepository.update(goal)
    return right(true)
  }
}

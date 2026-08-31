import { Either, left, right } from '#core/domain/index'
import { GetPreparationGoalInput, GetPreparationGoalUseCase, PreparationGoalEntity, PreparationGoalNotFoundError, StudentNotFoundError } from '../../domain/index.js'
import { FindPreparationGoalByIdRepository, FindStudentByUserIdRepository } from './ports/index.js'

export class GetPreparationGoalUseCaseImpl implements GetPreparationGoalUseCase {
  constructor(
    private readonly findStudentByUserIdRepository: FindStudentByUserIdRepository,
    private readonly findPreparationGoalByIdRepository: FindPreparationGoalByIdRepository
  ) {}

  async perform(input: GetPreparationGoalInput): Promise<Either<any, PreparationGoalEntity>> {
    const student = await this.findStudentByUserIdRepository.findByUserId(input.userId)
    if (!student) return left(new StudentNotFoundError())

    const goal = await this.findPreparationGoalByIdRepository.findById(input.goalId)
    if (!goal || goal.studentId.toString() !== student.id.toString()) {
      return left(new PreparationGoalNotFoundError())
    }

    return right(goal)
  }
}

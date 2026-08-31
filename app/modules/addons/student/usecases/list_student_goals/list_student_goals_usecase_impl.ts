import { Either, left, right } from '#core/domain/index'
import { PreparationGoalEntity, ListStudentGoalsInput, ListStudentGoalsUseCase, StudentNotFoundError } from '../../domain/index.js'
import { FindStudentByUserIdRepository, ListStudentGoalsRepository } from './ports/list_student_goals_ports.js'

export class ListStudentGoalsUseCaseImpl implements ListStudentGoalsUseCase {
  constructor(
    private readonly findStudentByUserIdRepository: FindStudentByUserIdRepository,
    private readonly listStudentGoalsRepository: ListStudentGoalsRepository
  ) {}

  async perform(input: ListStudentGoalsInput): Promise<Either<StudentNotFoundError, PreparationGoalEntity[]>> {
    const student = await this.findStudentByUserIdRepository.findByUserId(input.userId)
    if (!student) return left(new StudentNotFoundError())

    const goals = await this.listStudentGoalsRepository.listByStudentId(student.id.toString())
    return right(goals)
  }
}

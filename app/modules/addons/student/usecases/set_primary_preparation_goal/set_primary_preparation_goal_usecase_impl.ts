import { Either, IEventDispatcher, left, right } from '#core/domain/index'
import {
  PreparationGoalNotFoundError,
  PrimaryPreparationGoalChangedEvent,
  SetPrimaryPreparationGoalInput,
  SetPrimaryPreparationGoalUseCase,
  StudentNotFoundError,
} from '../../domain/index.js'
import {
  FindPreparationGoalByIdRepository,
  FindStudentByUserIdRepository,
  SetPrimaryGoalRepository,
} from './ports/set_primary_goal_ports.js'

export class SetPrimaryPreparationGoalUseCaseImpl implements SetPrimaryPreparationGoalUseCase {
  constructor(
    private readonly findStudentByUserIdRepository: FindStudentByUserIdRepository,
    private readonly findPreparationGoalByIdRepository: FindPreparationGoalByIdRepository,
    private readonly setPrimaryGoalRepository: SetPrimaryGoalRepository,
    private readonly eventDispatcher: IEventDispatcher
  ) {}

  async perform(input: SetPrimaryPreparationGoalInput): Promise<Either<any, boolean>> {
    const student = await this.findStudentByUserIdRepository.findByUserId(input.userId)
    if (!student) return left(new StudentNotFoundError())

    const goal = await this.findPreparationGoalByIdRepository.findById(input.goalId)
    if (!goal || goal.studentId.toString() !== student.id.toString()) {
      return left(new PreparationGoalNotFoundError())
    }

    await this.setPrimaryGoalRepository.setPrimary(student.id.toString(), goal.id.toString())

    await this.eventDispatcher.publish(
      new PrimaryPreparationGoalChangedEvent({
        studentId: student.id,
        newPrimaryGoalId: goal.id,
      })
    )

    return right(true)
  }
}

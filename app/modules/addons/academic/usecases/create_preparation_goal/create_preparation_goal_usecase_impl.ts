import { Either, IEventDispatcher, left, right, UniqueEntityID } from '#core/domain/index'
import {
  CourseInactiveError,
  CourseNotFoundError,
  CreatePreparationGoalUseCase,
  CreatePreparationGoalUseCaseInput,
  PreparationGoalAlreadyExistsError,
  PreparationGoalCreatedEvent,
  PreparationGoalEntity,
  UniversityInactiveError,
  UniversityNotFoundError,
} from '../../domain/index.js'
import {
  CreatePreparationGoalRepository,
  FindCourseByIdRepository,
  FindStudentGoalByCourseRepository,
  FindUniversityByIdRepository,
} from './ports/index.js'

export class CreatePreparationGoalUseCaseImpl implements CreatePreparationGoalUseCase {
  constructor(
    private readonly findUniversityByIdRepository: FindUniversityByIdRepository,
    private readonly findCourseByIdRepository: FindCourseByIdRepository,
    private readonly findStudentGoalByCourseRepository: FindStudentGoalByCourseRepository,
    private readonly createPreparationGoalRepository: CreatePreparationGoalRepository,
    private readonly eventDispatcher: IEventDispatcher
  ) {}

  async perform(input: CreatePreparationGoalUseCaseInput): Promise<Either<any, { id: string }>> {
    const university = await this.findUniversityByIdRepository.findById(input.universityId)
    if (!university) {
      return left(new UniversityNotFoundError())
    }

    if (!university.isActive) {
      return left(new UniversityInactiveError())
    }

    const course = await this.findCourseByIdRepository.findById(input.courseId)
    if (!course) {
      return left(new CourseNotFoundError())
    }

    if (!course.isActive) {
      return left(new CourseInactiveError())
    }

    const existingGoal = await this.findStudentGoalByCourseRepository.findByStudentAndCourse(
      input.studentId,
      input.courseId
    )

    if (existingGoal && existingGoal.isActive) {
      return left(new PreparationGoalAlreadyExistsError())
    }

    const goalOrError = PreparationGoalEntity.create({
      studentId: new UniqueEntityID(input.studentId),
      universityId: new UniqueEntityID(input.universityId),
      courseId: new UniqueEntityID(input.courseId),
      targetExamPeriod: input.targetExamPeriod,
    })

    if (goalOrError.isLeft()) {
      return left(goalOrError.value)
    }

    const goal = goalOrError.value

    await this.createPreparationGoalRepository.create(goal)

    await this.eventDispatcher.publish(
      new PreparationGoalCreatedEvent({
        goalId: goal.id,
        studentId: goal.studentId,
        universityId: goal.universityId,
        courseId: goal.courseId,
      })
    )

    return right({ id: goal.id.toString() })
  }
}

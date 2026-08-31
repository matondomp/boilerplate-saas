import { Either, IEventDispatcher, left, right, UniqueEntityID } from '#core/domain/index'
import {
  CourseDoesNotBelongToUniversityError,
  CourseInactiveError,
  CourseNotFoundError,
  CreatePreparationGoalInput,
  CreatePreparationGoalUseCase,
  PreparationGoalAlreadyExistsError,
  PreparationGoalCreatedEvent,
  PreparationGoalEntity,
  StudentEntity,
  StudentInactiveError,
  StudentSuspendedError,
  UniversityInactiveError,
  UniversityNotFoundError,
} from '../../domain/index.js'
import {
  CreatePreparationGoalRepository,
  CreateStudentRepository,
  FindCourseByIdPort,
  FindStudentByUserIdRepository,
  FindStudentGoalByCourseAndYearRepository,
  FindUniversityByIdPort,
} from './ports/index.js'

export class CreatePreparationGoalUseCaseImpl implements CreatePreparationGoalUseCase {
  constructor(
    private readonly findStudentByUserIdRepository: FindStudentByUserIdRepository,
    private readonly createStudentRepository: CreateStudentRepository,
    private readonly findUniversityByIdPort: FindUniversityByIdPort,
    private readonly findCourseByIdPort: FindCourseByIdPort,
    private readonly findStudentGoalByCourseAndYearRepository: FindStudentGoalByCourseAndYearRepository,
    private readonly createPreparationGoalRepository: CreatePreparationGoalRepository,
    private readonly eventDispatcher: IEventDispatcher
  ) {}

  async perform(input: CreatePreparationGoalInput): Promise<Either<any, { id: string }>> {
    let currentStudent: StudentEntity
    const existingStudent = await this.findStudentByUserIdRepository.findByUserId(input.userId)

    if (!existingStudent) {
      const createdStudent = StudentEntity.hydrate(new UniqueEntityID(), {
        userId: new UniqueEntityID(input.userId),
      })
      await this.createStudentRepository.create(createdStudent)
      currentStudent = createdStudent
    } else {
      currentStudent = existingStudent
    }

    if (!currentStudent.isActive) {
      return currentStudent.isSuspended ? left(new StudentSuspendedError()) : left(new StudentInactiveError())
    }

    const university = await this.findUniversityByIdPort.findUniversityById(input.universityId)
    if (!university) {
      return left(new UniversityNotFoundError())
    }
    if (!university.isActive) {
      return left(new UniversityInactiveError())
    }

    const course = await this.findCourseByIdPort.findCourseById(input.courseId)
    if (!course) {
      return left(new CourseNotFoundError())
    }
    if (!course.isActive) {
      return left(new CourseInactiveError())
    }
    if (course.universityId !== input.universityId) {
      return left(new CourseDoesNotBelongToUniversityError())
    }

    const existingGoal = await this.findStudentGoalByCourseAndYearRepository.findByStudentCourseAndYear(
      currentStudent.id.toString(),
      input.courseId,
      input.targetYear
    )

    if (existingGoal && existingGoal.isActive) {
      return left(new PreparationGoalAlreadyExistsError())
    }

    const goalOrError = PreparationGoalEntity.create({
      studentId: currentStudent.id,
      universityId: new UniqueEntityID(input.universityId),
      courseId: new UniqueEntityID(input.courseId),
      targetYear: input.targetYear,
      targetExamId: input.targetExamId ? new UniqueEntityID(input.targetExamId) : null,
      targetExamPeriod: input.targetExamPeriod,
      targetDate: input.targetDate,
      isPrimary: input.isPrimary ?? false,
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
        targetYear: goal.targetYear,
        isPrimary: goal.isPrimary,
      })
    )

    return right({ id: goal.id.toString() })
  }
}

import { Either, IEventDispatcher, left, right, UniqueEntityID } from '#core/domain/index'
import {
  CourseAlreadyExistsError,
  CourseCreatedEvent,
  CourseEntity,
  CreateCourseUseCase,
  CreateCourseUseCaseInput,
  UniversityInactiveError,
  UniversityNotFoundError,
} from '../../domain/index.js'
import {
  CreateCourseRepository,
  FindCourseByNameAndUniversityRepository,
  FindUniversityByIdRepository,
} from './ports/index.js'

export class CreateCourseUseCaseImpl implements CreateCourseUseCase {
  constructor(
    private readonly findUniversityByIdRepository: FindUniversityByIdRepository,
    private readonly findCourseByNameAndUniversityRepository: FindCourseByNameAndUniversityRepository,
    private readonly createCourseRepository: CreateCourseRepository,
    private readonly eventDispatcher: IEventDispatcher
  ) {}

  async perform(input: CreateCourseUseCaseInput): Promise<Either<any, { id: string }>> {
    const university = await this.findUniversityByIdRepository.findById(input.universityId)
    if (!university) {
      return left(new UniversityNotFoundError())
    }

    if (!university.isActive) {
      return left(new UniversityInactiveError())
    }

    const courseOrError = CourseEntity.create({
      universityId: new UniqueEntityID(input.universityId),
      academicUnitId: input.academicUnitId ? new UniqueEntityID(input.academicUnitId) : null,
      name: input.name,
    })

    if (courseOrError.isLeft()) {
      return left(courseOrError.value)
    }

    const course = courseOrError.value

    const existingCourse = await this.findCourseByNameAndUniversityRepository.findByNameAndUniversity(
      course.name,
      input.universityId
    )

    if (existingCourse) {
      return left(new CourseAlreadyExistsError())
    }

    await this.createCourseRepository.create(course)

    await this.eventDispatcher.publish(
      new CourseCreatedEvent({
        courseId: course.id,
        universityId: course.universityId,
        name: course.name,
      })
    )

    return right({ id: course.id.toString() })
  }
}

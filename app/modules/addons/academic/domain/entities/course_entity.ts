import { Either, Entity, left, Options, right, UniqueEntityID } from '#core/domain/index'
import { CourseNameRequiredError, CourseUniversityRequiredError } from '../errors/index.js'
import { CourseStatus } from '../value_objects/index.js'

type Errors = CourseNameRequiredError | CourseUniversityRequiredError

export interface CourseProps {
  universityId: UniqueEntityID
  academicUnitId?: UniqueEntityID | null
  name: string
  status?: CourseStatus
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date | null
}

export class CourseEntity extends Entity<CourseProps> {
  get universityId(): UniqueEntityID {
    return this.props.universityId
  }

  get academicUnitId(): UniqueEntityID | null | undefined {
    return this.props.academicUnitId
  }

  get name(): string {
    return this.props.name
  }

  get status(): CourseStatus {
    return this.props.status ?? CourseStatus.ACTIVE
  }

  get isActive(): boolean {
    return this.status === CourseStatus.ACTIVE
  }

  changeName(name: string): void {
    this.props.name = name.trim()
  }

  setAcademicUnit(academicUnitId: UniqueEntityID | null): void {
    this.props.academicUnitId = academicUnitId
  }

  activate(): void {
    this.props.status = CourseStatus.ACTIVE
  }

  deactivate(): void {
    this.props.status = CourseStatus.INACTIVE
  }

  validate(): Either<Errors, boolean> {
    if (!this.props.universityId) {
      return left(new CourseUniversityRequiredError())
    }

    if (!this.props.name || !this.props.name.trim().length) {
      return left(new CourseNameRequiredError())
    }

    return right(true)
  }

  static create(props: CourseProps): Either<Errors, CourseEntity> {
    const course = new CourseEntity({
      universityId: props.universityId,
      academicUnitId: props.academicUnitId,
      name: props.name?.trim(),
      status: props.status ?? CourseStatus.ACTIVE,
    })

    const validation = course.validate()
    if (validation.isLeft()) {
      return left(validation.value)
    }

    return right(course)
  }

  static hydrate(id: UniqueEntityID, props: CourseProps, options?: Options): CourseEntity {
    return new CourseEntity(props, id, options)
  }
}

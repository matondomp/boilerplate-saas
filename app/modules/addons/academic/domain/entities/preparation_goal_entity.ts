import { Either, Entity, left, Options, right, UniqueEntityID } from '#core/domain/index'
import {
  PreparationGoalCourseRequiredError,
  PreparationGoalStudentRequiredError,
  PreparationGoalUniversityRequiredError,
} from '../errors/index.js'
import { PreparationGoalStatus } from '../value_objects/index.js'

type Errors =
  | PreparationGoalStudentRequiredError
  | PreparationGoalUniversityRequiredError
  | PreparationGoalCourseRequiredError

export interface PreparationGoalProps {
  studentId: UniqueEntityID
  universityId: UniqueEntityID
  courseId: UniqueEntityID
  targetExamPeriod?: string | null
  status?: PreparationGoalStatus
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date | null
}

export class PreparationGoalEntity extends Entity<PreparationGoalProps> {
  get studentId(): UniqueEntityID {
    return this.props.studentId
  }

  get universityId(): UniqueEntityID {
    return this.props.universityId
  }

  get courseId(): UniqueEntityID {
    return this.props.courseId
  }

  get targetExamPeriod(): string | null | undefined {
    return this.props.targetExamPeriod
  }

  get status(): PreparationGoalStatus {
    return this.props.status ?? PreparationGoalStatus.ACTIVE
  }

  get isActive(): boolean {
    return this.status === PreparationGoalStatus.ACTIVE
  }

  archive(): void {
    this.props.status = PreparationGoalStatus.ARCHIVED
  }

  activate(): void {
    this.props.status = PreparationGoalStatus.ACTIVE
  }

  validate(): Either<Errors, boolean> {
    if (!this.props.studentId) {
      return left(new PreparationGoalStudentRequiredError())
    }

    if (!this.props.universityId) {
      return left(new PreparationGoalUniversityRequiredError())
    }

    if (!this.props.courseId) {
      return left(new PreparationGoalCourseRequiredError())
    }

    return right(true)
  }

  static create(props: PreparationGoalProps): Either<Errors, PreparationGoalEntity> {
    const goal = new PreparationGoalEntity({
      studentId: props.studentId,
      universityId: props.universityId,
      courseId: props.courseId,
      targetExamPeriod: props.targetExamPeriod?.trim() || null,
      status: props.status ?? PreparationGoalStatus.ACTIVE,
    })

    const validation = goal.validate()
    if (validation.isLeft()) {
      return left(validation.value)
    }

    return right(goal)
  }

  static hydrate(
    id: UniqueEntityID,
    props: PreparationGoalProps,
    options?: Options
  ): PreparationGoalEntity {
    return new PreparationGoalEntity(props, id, options)
  }
}

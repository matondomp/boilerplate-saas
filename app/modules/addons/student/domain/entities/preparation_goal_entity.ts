import { Either, Entity, left, Options, right, UniqueEntityID } from '#core/domain/index'
import {
  InvalidGoalStatusTransitionError,
  PreparationGoalCourseRequiredError,
  PreparationGoalStudentRequiredError,
  PreparationGoalUniversityRequiredError,
} from '../errors/index.js'
import { PreparationGoalStatus } from '../value_objects/index.js'

type Errors =
  | PreparationGoalStudentRequiredError
  | PreparationGoalUniversityRequiredError
  | PreparationGoalCourseRequiredError
  | InvalidGoalStatusTransitionError

export interface PreparationGoalProps {
  studentId: UniqueEntityID
  universityId: UniqueEntityID
  courseId: UniqueEntityID
  targetYear: number
  targetExamId?: UniqueEntityID | null
  targetExamPeriod?: string | null
  targetDate?: Date | null
  status?: PreparationGoalStatus
  isPrimary?: boolean
  startedAt?: Date | null
  completedAt?: Date | null
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

  get targetYear(): number {
    return this.props.targetYear
  }

  get targetExamId(): UniqueEntityID | null | undefined {
    return this.props.targetExamId
  }

  get targetExamPeriod(): string | null | undefined {
    return this.props.targetExamPeriod
  }

  get targetDate(): Date | null | undefined {
    return this.props.targetDate
  }

  get status(): PreparationGoalStatus {
    return this.props.status ?? PreparationGoalStatus.ACTIVE
  }

  get isPrimary(): boolean {
    return this.props.isPrimary ?? false
  }

  get startedAt(): Date | null | undefined {
    return this.props.startedAt
  }

  get completedAt(): Date | null | undefined {
    return this.props.completedAt
  }

  get isActive(): boolean {
    return this.status === PreparationGoalStatus.ACTIVE
  }

  get isPaused(): boolean {
    return this.status === PreparationGoalStatus.PAUSED
  }

  get isCompleted(): boolean {
    return this.status === PreparationGoalStatus.COMPLETED
  }

  setPrimary(value: boolean): void {
    this.props.isPrimary = value
  }

  pause(): Either<InvalidGoalStatusTransitionError, boolean> {
    if (this.status !== PreparationGoalStatus.ACTIVE) {
      return left(new InvalidGoalStatusTransitionError())
    }
    this.props.status = PreparationGoalStatus.PAUSED
    return right(true)
  }

  resume(): Either<InvalidGoalStatusTransitionError, boolean> {
    if (this.status !== PreparationGoalStatus.PAUSED) {
      return left(new InvalidGoalStatusTransitionError())
    }
    this.props.status = PreparationGoalStatus.ACTIVE
    return right(true)
  }

  complete(): Either<InvalidGoalStatusTransitionError, boolean> {
    if (this.status !== PreparationGoalStatus.ACTIVE && this.status !== PreparationGoalStatus.PAUSED) {
      return left(new InvalidGoalStatusTransitionError())
    }
    this.props.status = PreparationGoalStatus.COMPLETED
    this.props.completedAt = new Date()
    return right(true)
  }

  cancel(): Either<InvalidGoalStatusTransitionError, boolean> {
    if (this.status === PreparationGoalStatus.COMPLETED) {
      return left(new InvalidGoalStatusTransitionError())
    }
    this.props.status = PreparationGoalStatus.CANCELLED
    return right(true)
  }

  archive(): void {
    this.props.status = PreparationGoalStatus.ARCHIVED
  }

  updateTargetDetails(targetYear?: number, targetExamPeriod?: string | null, targetDate?: Date | null): void {
    if (targetYear) this.props.targetYear = targetYear
    if (targetExamPeriod !== undefined) this.props.targetExamPeriod = targetExamPeriod?.trim() || null
    if (targetDate !== undefined) this.props.targetDate = targetDate
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
      targetYear: props.targetYear || new Date().getFullYear(),
      targetExamId: props.targetExamId || null,
      targetExamPeriod: props.targetExamPeriod?.trim() || null,
      targetDate: props.targetDate || null,
      status: props.status ?? PreparationGoalStatus.ACTIVE,
      isPrimary: props.isPrimary ?? false,
      startedAt: props.startedAt || new Date(),
      completedAt: props.completedAt || null,
    })

    const validation = goal.validate()
    if (validation.isLeft()) {
      return left(validation.value)
    }

    return right(goal)
  }

  static hydrate(id: UniqueEntityID, props: PreparationGoalProps, options?: Options): PreparationGoalEntity {
    return new PreparationGoalEntity(props, id, options)
  }
}

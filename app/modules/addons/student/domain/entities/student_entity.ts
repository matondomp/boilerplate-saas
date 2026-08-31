import { Entity, Options, right, UniqueEntityID, Either } from '#core/domain/index'
import { StudentStatus } from '../value_objects/index.js'
import { StudentProfileEntity } from './student_profile_entity.js'

export interface StudentProps {
  userId: UniqueEntityID
  status?: StudentStatus
  profile?: StudentProfileEntity | null
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date | null
}

export class StudentEntity extends Entity<StudentProps> {
  get userId(): UniqueEntityID {
    return this.props.userId
  }

  get status(): StudentStatus {
    return this.props.status ?? StudentStatus.ACTIVE
  }

  get profile(): StudentProfileEntity | null | undefined {
    return this.props.profile
  }

  get isActive(): boolean {
    return this.status === StudentStatus.ACTIVE
  }

  get isSuspended(): boolean {
    return this.status === StudentStatus.SUSPENDED
  }

  activate(): void {
    this.props.status = StudentStatus.ACTIVE
  }

  deactivate(): void {
    this.props.status = StudentStatus.INACTIVE
  }

  suspend(): void {
    this.props.status = StudentStatus.SUSPENDED
  }

  attachProfile(profile: StudentProfileEntity): void {
    this.props.profile = profile
  }

  static create(props: StudentProps): Either<any, StudentEntity> {
    const student = new StudentEntity({
      userId: props.userId,
      status: props.status ?? StudentStatus.ACTIVE,
      profile: props.profile || null,
    })
    return right(student) as Either<any, StudentEntity>
  }

  static hydrate(id: UniqueEntityID, props: StudentProps, options?: Options): StudentEntity {
    return new StudentEntity(props, id, options)
  }
}

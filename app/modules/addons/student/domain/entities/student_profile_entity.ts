import { Entity, Options, right, UniqueEntityID, Either } from '#core/domain/index'

export interface StudentProfileProps {
  studentId: UniqueEntityID
  fullName: string
  phone?: string | null
  avatarUrl?: string | null
  preferredLanguage?: string
  birthYear?: number | null
  createdAt?: Date
  updatedAt?: Date
}

export class StudentProfileEntity extends Entity<StudentProfileProps> {
  get studentId(): UniqueEntityID {
    return this.props.studentId
  }

  get fullName(): string {
    return this.props.fullName
  }

  get phone(): string | null | undefined {
    return this.props.phone
  }

  get avatarUrl(): string | null | undefined {
    return this.props.avatarUrl
  }

  get preferredLanguage(): string {
    return this.props.preferredLanguage ?? 'pt'
  }

  get birthYear(): number | null | undefined {
    return this.props.birthYear
  }

  updateProfile(props: Partial<Pick<StudentProfileProps, 'fullName' | 'phone' | 'avatarUrl' | 'preferredLanguage' | 'birthYear'>>): void {
    if (props.fullName) this.props.fullName = props.fullName.trim()
    if (props.phone !== undefined) this.props.phone = props.phone?.trim() || null
    if (props.avatarUrl !== undefined) this.props.avatarUrl = props.avatarUrl?.trim() || null
    if (props.preferredLanguage) this.props.preferredLanguage = props.preferredLanguage.trim()
    if (props.birthYear !== undefined) this.props.birthYear = props.birthYear
  }

  static create(props: StudentProfileProps): Either<any, StudentProfileEntity> {
    const profile = new StudentProfileEntity({
      studentId: props.studentId,
      fullName: props.fullName.trim(),
      phone: props.phone?.trim() || null,
      avatarUrl: props.avatarUrl?.trim() || null,
      preferredLanguage: props.preferredLanguage || 'pt',
      birthYear: props.birthYear || null,
    })
    return right(profile)
  }

  static hydrate(id: UniqueEntityID, props: StudentProfileProps, options?: Options): StudentProfileEntity {
    return new StudentProfileEntity(props, id, options)
  }
}

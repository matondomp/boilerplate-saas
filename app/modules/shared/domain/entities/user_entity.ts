import { StatusEnum, StatusType } from '#shared/domain/types/index'
import { PasswordMismatchError, UserNameErrors } from '#shared/domain/errors/index'
import { Either, Entity, left, Options, right, UniqueEntityID } from '#core/domain/index'
import { Email } from '#shared/domain/value_objects/email'

export interface UserProps {
  avatar?: string
  firstName: string
  lastName: string
  email: Email
  defaultLang: string
  password: string
  roleId: UniqueEntityID
  status?: StatusType
  slug?: string
  timezone: string
  lastLoginAt?: Date
}

type UserEntityError =
  | UserNameErrors.UserFirstNameRequiredError
  | UserNameErrors.UserLastNameRequiredError

export class UserEntity extends Entity<UserProps> {
  get fullName(): string {
    return `${this.props.firstName} ${this.props.lastName ?? ''}`
  }

  get firstName(): string {
    return this.props.firstName
  }

  get lastName(): string {
    return this.props.lastName
  }

  get email(): string {
    return this.props.email.value
  }

  get password(): string {
    return this.props.password
  }

  get lastLoginAt(): Date | undefined {
    return this.props.lastLoginAt
  }

  get defaultLang(): string {
    return this.props.defaultLang
  }

  get avatar(): string | undefined {
    return this.props.avatar
  }
  get status(): StatusType | undefined {
    return this.props.status
  }

  get slug(): string {
    return this.props.slug as string
  }

  get roleId(): string {
    return this.props.roleId.toString()
  }

  get timezone(): string {
    return this.props.timezone
  }

  get isInactive(): boolean {
    return this.props.status === StatusEnum.INACTIVE
  }

  changePassword(
    password: string,
    confirmPassword: string
  ): Either<PasswordMismatchError, boolean> {
    if (password !== confirmPassword) {
      return left(new PasswordMismatchError())
    }

    this.props.password = password

    return right(true)
  }

  get isRoot(): boolean {
    return this.props.email.value === (process.env.ROOT_USER_EMAIL ?? 'root@mp.co.ao')
  }

  userLogged(loggedAt: Date): void {
    this.props.lastLoginAt = loggedAt
  }

  changeAvatar(avatar: string): void {
    this.props.avatar = avatar
  }

  changeFirstName(firstName: string): void {
    this.props.firstName = firstName
  }

  changeLastName(lastName: string): void {
    this.props.lastName = lastName
  }

  changeLanguage(language: string): void {
    this.props.defaultLang = language
  }

  changeTimezone(timezone: string): void {
    this.props.timezone = timezone
  }

  updatePermissions(roleId: UniqueEntityID): void {
    this.props.roleId = roleId
  }

  alterEmail(email: Email): void {
    this.props.email = email
  }

  block() {
    this.props.status = StatusEnum.INACTIVE
  }

  restore() {
    this.props.status = StatusEnum.ACTIVE
  }

  validate(): Either<UserEntityError, boolean> {
    if (!this.props.firstName || !this.props.firstName.trim().length) {
      return left(new UserNameErrors.UserFirstNameRequiredError())
    }

    if (!this.props.lastName || !this.props.lastName.trim().length) {
      return left(new UserNameErrors.UserLastNameRequiredError())
    }

    return right(true)
  }

  delete(): void {
    this._deletedAt = new Date()
    this.props.status = StatusEnum.DELETED
  }

  static create(props: UserProps): Either<UserEntityError, UserEntity> {
    const userEntity = new UserEntity(props)

    const validation = userEntity.validate()

    if (validation.isLeft()) {
      return left(validation.value)
    }

    return right(userEntity)
  }

  static hydrate(
    id: UniqueEntityID,
    props: UserProps,
    options?: Options
  ): Either<UserEntityError, UserEntity> {
    const userEntity = new UserEntity(props, id, options)

    const validation = userEntity.validate()

    if (validation.isLeft()) {
      return left(validation.value)
    }
    return right(userEntity)
  }
}

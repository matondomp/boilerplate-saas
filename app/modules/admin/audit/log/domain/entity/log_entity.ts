import { Either } from '#core/domain/either'
import { Entity, right, left, UniqueEntityID, Options } from '#core/domain/index'
import { UserNameRequiredError } from '../errors/user_name_required_error.js'
import { TittleRequiredError } from '../errors/title_required_error.js'
import { SummaryRequiredError } from '../errors/summary_required_error.js'
import { FullLog, LogInterface } from '#modules/admin/audit/log/domain/interfaces/index'

interface LogProps extends Omit<LogInterface, 'createdAt'> {
  hash?: string
}

export class LogEntity extends Entity<LogProps> {
  get title(): string {
    return this.props.title
  }

  get success(): boolean {
    return this.props.success
  }

  get username(): string {
    return this.props.username
  }

  get source(): string {
    return this.props.source
  }

  get summary(): string {
    return this.props.summary
  }

  get fullLog(): FullLog {
    return this.props.fullLog
  }

  get errorMessage(): string | undefined {
    return this.props.errorMessage
  }

  get userId(): string {
    return this.props.userId
  }

  get hash(): string | undefined {
    return this.props.hash
  }

  validate(): Either<UserNameRequiredError | TittleRequiredError | SummaryRequiredError, boolean> {
    if (!this.props.username || this.props.username.length === 0) {
      return left(new UserNameRequiredError())
    }

    if (!this.props.title || this.props.title.length === 0) {
      return left(new TittleRequiredError())
    }

    if (!this.props.summary || Object.keys(this.props.summary).length === 0) {
      return left(new SummaryRequiredError())
    }

    return right(true)
  }

  static create(
    props: LogProps
  ): Either<UserNameRequiredError | TittleRequiredError | SummaryRequiredError, LogEntity> {
    const logEntity = new LogEntity(props)

    const validation = logEntity.validate()

    if (validation.isLeft()) {
      return left(validation.value)
    }

    return right(logEntity)
  }

  static hydrate(id: UniqueEntityID, props: LogProps, options?: Options) {
    return new LogEntity(props, id, options)
  }
}

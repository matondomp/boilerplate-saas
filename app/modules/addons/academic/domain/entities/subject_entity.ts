import { Either, Entity, left, Options, right, UniqueEntityID } from '#core/domain/index'
import { SubjectNameRequiredError } from '../errors/index.js'

type Errors = SubjectNameRequiredError

export interface SubjectProps {
  name: string
  description?: string | null
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date | null
}

export class SubjectEntity extends Entity<SubjectProps> {
  get name(): string {
    return this.props.name
  }

  get description(): string | null | undefined {
    return this.props.description
  }

  changeName(name: string): void {
    this.props.name = name.trim()
  }

  changeDescription(description: string | null): void {
    this.props.description = description ? description.trim() : null
  }

  validate(): Either<Errors, boolean> {
    if (!this.props.name || !this.props.name.trim().length) {
      return left(new SubjectNameRequiredError())
    }

    return right(true)
  }

  static create(props: SubjectProps): Either<Errors, SubjectEntity> {
    const subject = new SubjectEntity({
      name: props.name?.trim(),
      description: props.description?.trim() || null,
    })

    const validation = subject.validate()
    if (validation.isLeft()) {
      return left(validation.value)
    }

    return right(subject)
  }

  static hydrate(id: UniqueEntityID, props: SubjectProps, options?: Options): SubjectEntity {
    return new SubjectEntity(props, id, options)
  }
}

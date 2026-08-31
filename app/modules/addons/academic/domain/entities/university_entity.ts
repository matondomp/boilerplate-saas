import { Either, Entity, left, Options, right, UniqueEntityID } from '#core/domain/index'
import {
  UniversityAcronymRequiredError,
  UniversityNameRequiredError,
} from '../errors/index.js'
import { UniversityStatus } from '../value_objects/index.js'

type Errors = UniversityNameRequiredError | UniversityAcronymRequiredError

export interface UniversityProps {
  name: string
  acronym: string
  status?: UniversityStatus
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date | null
}

export class UniversityEntity extends Entity<UniversityProps> {
  get name(): string {
    return this.props.name
  }

  get acronym(): string {
    return this.props.acronym
  }

  get status(): UniversityStatus {
    return this.props.status ?? UniversityStatus.ACTIVE
  }

  get isActive(): boolean {
    return this.status === UniversityStatus.ACTIVE
  }

  changeName(name: string): void {
    this.props.name = name.trim()
  }

  changeAcronym(acronym: string): void {
    this.props.acronym = acronym.trim().toUpperCase()
  }

  activate(): void {
    this.props.status = UniversityStatus.ACTIVE
  }

  deactivate(): void {
    this.props.status = UniversityStatus.INACTIVE
  }

  validate(): Either<Errors, boolean> {
    if (!this.props.name || !this.props.name.trim().length) {
      return left(new UniversityNameRequiredError())
    }

    if (!this.props.acronym || !this.props.acronym.trim().length) {
      return left(new UniversityAcronymRequiredError())
    }

    return right(true)
  }

  static create(props: UniversityProps): Either<Errors, UniversityEntity> {
    const university = new UniversityEntity({
      name: props.name?.trim(),
      acronym: props.acronym?.trim()?.toUpperCase(),
      status: props.status ?? UniversityStatus.ACTIVE,
    })

    const validation = university.validate()
    if (validation.isLeft()) {
      return left(validation.value)
    }

    return right(university)
  }

  static hydrate(id: UniqueEntityID, props: UniversityProps, options?: Options): UniversityEntity {
    return new UniversityEntity(props, id, options)
  }
}

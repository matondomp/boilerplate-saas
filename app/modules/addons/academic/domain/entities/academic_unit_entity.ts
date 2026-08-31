import { Either, Entity, left, Options, right, UniqueEntityID } from '#core/domain/index'
import {
  AcademicUnitNameRequiredError,
  AcademicUnitUniversityRequiredError,
} from '../errors/index.js'

type Errors = AcademicUnitNameRequiredError | AcademicUnitUniversityRequiredError

export interface AcademicUnitProps {
  universityId: UniqueEntityID
  name: string
  type: string
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date | null
}

export class AcademicUnitEntity extends Entity<AcademicUnitProps> {
  get universityId(): UniqueEntityID {
    return this.props.universityId
  }

  get name(): string {
    return this.props.name
  }

  get type(): string {
    return this.props.type
  }

  changeName(name: string): void {
    this.props.name = name.trim()
  }

  changeType(type: string): void {
    this.props.type = type.trim()
  }

  validate(): Either<Errors, boolean> {
    if (!this.props.universityId) {
      return left(new AcademicUnitUniversityRequiredError())
    }

    if (!this.props.name || !this.props.name.trim().length) {
      return left(new AcademicUnitNameRequiredError())
    }

    return right(true)
  }

  static create(props: AcademicUnitProps): Either<Errors, AcademicUnitEntity> {
    const academicUnit = new AcademicUnitEntity({
      universityId: props.universityId,
      name: props.name?.trim(),
      type: props.type?.trim() || 'Faculdade',
    })

    const validation = academicUnit.validate()
    if (validation.isLeft()) {
      return left(validation.value)
    }

    return right(academicUnit)
  }

  static hydrate(
    id: UniqueEntityID,
    props: AcademicUnitProps,
    options?: Options
  ): AcademicUnitEntity {
    return new AcademicUnitEntity(props, id, options)
  }
}

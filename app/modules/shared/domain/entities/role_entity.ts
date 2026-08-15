import { Either, Entity, left, Options, right, UniqueEntityID } from '#core/domain/index'
import {
  PermissionAreMissingError,
  RoleDescriptionRequiredError,
  RoleNameRequiredError,
} from '../errors/index.js'

type Errors = RoleNameRequiredError | RoleDescriptionRequiredError | PermissionAreMissingError

export interface RoleProps {
  name: string
  slug?: string
  description: string
  internal?: boolean
  permissions: UniqueEntityID[]
  user?: UniqueEntityID
}

export class RoleEntity extends Entity<RoleProps> {
  get name(): string {
    return this.props.name
  }

  get isInternal(): boolean {
    return this.props.internal ?? false
  }

  get description(): string {
    return this.props.description
  }

  get slug(): string {
    return this.props.slug as string
  }

  get permissions(): UniqueEntityID[] {
    return this.props.permissions
  }

  get user(): UniqueEntityID | undefined {
    return this.props.user
  }

  changeName(name: string): void {
    this.props.name = name
  }

  changeDescription(description: string): void {
    this.props.description = description
  }

  updatePermissions(permissions: UniqueEntityID[]): void {
    this.props.permissions = permissions
  }

  validate(): Either<Errors, boolean> {
    if (!this.props.name || !this.props.name.length) {
      return left(new RoleNameRequiredError())
    }

    if (!this.props.description || !this.props.description.length) {
      return left(new RoleDescriptionRequiredError())
    }

    if (!this.props.permissions || this.props.permissions.length <= 0) {
      return left(new PermissionAreMissingError())
    }

    return right(true)
  }

  static create(prop: RoleProps): Either<Errors, RoleEntity> {
    const roleEntity = new RoleEntity({
      name: prop.name,
      description: prop.description,
      permissions: prop.permissions,
      user: prop.user,
      internal: false,
    })

    const validation = roleEntity.validate()
    if (validation.isLeft()) {
      return left(validation.value)
    }

    return right(roleEntity)
  }

  static hydrate(id: UniqueEntityID, props: RoleProps, options?: Options): RoleEntity {
    return new RoleEntity(props, id, options)
  }
}

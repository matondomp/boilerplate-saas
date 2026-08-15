import { Entity, UniqueEntityID } from '#core/domain/index'

export interface PermissionProps {
  name: string
  description: string

  group: string
}

export class PermissionEntity extends Entity<PermissionProps> {
  get name(): string {
    return this.props.name
  }

  get description(): string {
    return this.props.description
  }

  get group(): string {
    return this.props.group
  }

  static hydrate(id: UniqueEntityID, props: PermissionProps): PermissionEntity {
    return new PermissionEntity(props, id)
  }
}

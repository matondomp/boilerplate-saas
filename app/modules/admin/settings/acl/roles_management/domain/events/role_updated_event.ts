import { DomainEvent, UniqueEntityID } from '#core/domain/index'

export interface RoleUpdatedProps {
  older: {
    name: string
    description: string
    permissions: UniqueEntityID[]
  }
  roleId: UniqueEntityID
}

export class RoleUpdatedEvent extends DomainEvent<RoleUpdatedProps> {}

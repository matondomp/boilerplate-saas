import { DomainEvent, UniqueEntityID } from '#core/domain/index'

interface RoleCreatedProps {
  roleId: UniqueEntityID
}

export class RoleCreatedEvent extends DomainEvent<RoleCreatedProps> {}

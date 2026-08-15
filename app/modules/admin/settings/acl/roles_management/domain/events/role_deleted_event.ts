import { DomainEvent, UniqueEntityID } from '#core/domain/index'

interface RoleDeletedProps {
  roleId: UniqueEntityID
}

export class RoleDeleted extends DomainEvent<RoleDeletedProps> {}

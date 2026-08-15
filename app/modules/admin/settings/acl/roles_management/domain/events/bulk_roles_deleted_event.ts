import { DomainEvent, UniqueEntityID } from '#core/domain/index'

interface BulkRolesDeletedProps {
  roles: UniqueEntityID[]
}

export class BulkRolesDeletedEvent extends DomainEvent<BulkRolesDeletedProps> {}

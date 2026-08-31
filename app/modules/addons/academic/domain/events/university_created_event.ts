import { DomainEvent, UniqueEntityID } from '#core/domain/index'

interface UniversityCreatedProps {
  universityId: UniqueEntityID
  name: string
  acronym: string
}

export class UniversityCreatedEvent extends DomainEvent<UniversityCreatedProps> {}

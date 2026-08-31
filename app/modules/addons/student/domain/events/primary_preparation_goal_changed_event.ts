import { DomainEvent, UniqueEntityID } from '#core/domain/index'

interface PrimaryPreparationGoalChangedProps {
  studentId: UniqueEntityID
  newPrimaryGoalId: UniqueEntityID
}

export class PrimaryPreparationGoalChangedEvent extends DomainEvent<PrimaryPreparationGoalChangedProps> {}

import { DomainEvent, UniqueEntityID } from '#core/domain/index'

interface PreparationGoalCreatedProps {
  goalId: UniqueEntityID
  studentId: UniqueEntityID
  universityId: UniqueEntityID
  courseId: UniqueEntityID
}

export class PreparationGoalCreatedEvent extends DomainEvent<PreparationGoalCreatedProps> {}

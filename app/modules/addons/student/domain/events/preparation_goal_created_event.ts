import { DomainEvent, UniqueEntityID } from '#core/domain/index'

interface PreparationGoalCreatedProps {
  goalId: UniqueEntityID
  studentId: UniqueEntityID
  universityId: UniqueEntityID
  courseId: UniqueEntityID
  targetYear: number
  isPrimary: boolean
}

export class PreparationGoalCreatedEvent extends DomainEvent<PreparationGoalCreatedProps> {}

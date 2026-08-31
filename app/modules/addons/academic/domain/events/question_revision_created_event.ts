import { DomainEvent, UniqueEntityID } from '#core/domain/index'

interface QuestionRevisionCreatedProps {
  questionId: UniqueEntityID
  revisionNumber: number
  authorId: UniqueEntityID
  reason: string
}

export class QuestionRevisionCreatedEvent extends DomainEvent<QuestionRevisionCreatedProps> {}

import { DomainEvent, UniqueEntityID } from '#core/domain/index'
import { QuestionStatus } from '../value_objects/index.js'

interface QuestionStatusChangedProps {
  questionId: UniqueEntityID
  previousStatus: QuestionStatus
  newStatus: QuestionStatus
  authorId?: UniqueEntityID
}

export class QuestionStatusChangedEvent extends DomainEvent<QuestionStatusChangedProps> {}

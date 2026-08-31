import { DomainEvent, UniqueEntityID } from '#core/domain/index'

interface ExamPublishedProps {
  examId: UniqueEntityID
  courseId: UniqueEntityID
  year: number
  period: string
}

export class ExamPublishedEvent extends DomainEvent<ExamPublishedProps> {}

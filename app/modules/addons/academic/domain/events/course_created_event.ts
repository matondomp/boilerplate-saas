import { DomainEvent, UniqueEntityID } from '#core/domain/index'

interface CourseCreatedProps {
  courseId: UniqueEntityID
  universityId: UniqueEntityID
  name: string
}

export class CourseCreatedEvent extends DomainEvent<CourseCreatedProps> {}

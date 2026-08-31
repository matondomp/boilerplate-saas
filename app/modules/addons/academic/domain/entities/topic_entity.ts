import { Either, Entity, left, Options, right, UniqueEntityID } from '#core/domain/index'
import { TopicNameRequiredError, TopicSubjectRequiredError } from '../errors/index.js'

type Errors = TopicNameRequiredError | TopicSubjectRequiredError

export interface TopicProps {
  subjectId: UniqueEntityID
  parentId?: UniqueEntityID | null
  name: string
  level?: number
  position?: number
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date | null
}

export class TopicEntity extends Entity<TopicProps> {
  get subjectId(): UniqueEntityID {
    return this.props.subjectId
  }

  get parentId(): UniqueEntityID | null | undefined {
    return this.props.parentId
  }

  get name(): string {
    return this.props.name
  }

  get level(): number {
    return this.props.level ?? 1
  }

  get position(): number {
    return this.props.position ?? 0
  }

  changeName(name: string): void {
    this.props.name = name.trim()
  }

  setParent(parentId: UniqueEntityID | null, parentLevel?: number): void {
    this.props.parentId = parentId
    if (parentId && parentLevel !== undefined) {
      this.props.level = parentLevel + 1
    } else if (!parentId) {
      this.props.level = 1
    }
  }

  changePosition(position: number): void {
    this.props.position = position
  }

  validate(): Either<Errors, boolean> {
    if (!this.props.subjectId) {
      return left(new TopicSubjectRequiredError())
    }

    if (!this.props.name || !this.props.name.trim().length) {
      return left(new TopicNameRequiredError())
    }

    return right(true)
  }

  static create(props: TopicProps): Either<Errors, TopicEntity> {
    const topic = new TopicEntity({
      subjectId: props.subjectId,
      parentId: props.parentId ?? null,
      name: props.name?.trim(),
      level: props.level ?? 1,
      position: props.position ?? 0,
    })

    const validation = topic.validate()
    if (validation.isLeft()) {
      return left(validation.value)
    }

    return right(topic)
  }

  static hydrate(id: UniqueEntityID, props: TopicProps, options?: Options): TopicEntity {
    return new TopicEntity(props, id, options)
  }
}

import { Either, left, right, UniqueEntityID } from '#core/domain/index'
import {
  CreateTopicUseCase,
  CreateTopicUseCaseInput,
  SubjectNotFoundError,
  TopicEntity,
  TopicNotFoundError,
} from '../../domain/index.js'
import {
  CreateTopicRepository,
  FindSubjectByIdRepository,
  FindTopicByIdRepository,
} from './ports/index.js'

export class CreateTopicUseCaseImpl implements CreateTopicUseCase {
  constructor(
    private readonly findSubjectByIdRepository: FindSubjectByIdRepository,
    private readonly findTopicByIdRepository: FindTopicByIdRepository,
    private readonly createTopicRepository: CreateTopicRepository
  ) {}

  async perform(input: CreateTopicUseCaseInput): Promise<Either<any, { id: string }>> {
    const subject = await this.findSubjectByIdRepository.findById(input.subjectId)
    if (!subject) {
      return left(new SubjectNotFoundError())
    }

    let parentTopic: TopicEntity | null = null
    if (input.parentId) {
      parentTopic = await this.findTopicByIdRepository.findById(input.parentId)
      if (!parentTopic) {
        return left(new TopicNotFoundError())
      }
    }

    const topicOrError = TopicEntity.create({
      subjectId: new UniqueEntityID(input.subjectId),
      parentId: input.parentId ? new UniqueEntityID(input.parentId) : null,
      name: input.name,
      level: parentTopic ? parentTopic.level + 1 : 1,
      position: input.position ?? 0,
    })

    if (topicOrError.isLeft()) {
      return left(topicOrError.value)
    }

    const topic = topicOrError.value
    await this.createTopicRepository.create(topic)

    return right({ id: topic.id.toString() })
  }
}

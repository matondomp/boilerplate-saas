import { SubjectEntity, TopicEntity } from '../../../domain/entities/index.js'

export interface FindSubjectByIdRepository {
  findById(id: string): Promise<SubjectEntity | null>
}

export interface FindTopicByIdRepository {
  findById(id: string): Promise<TopicEntity | null>
}

export interface CreateTopicRepository {
  create(topic: TopicEntity): Promise<void>
}

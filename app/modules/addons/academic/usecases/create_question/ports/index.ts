import { QuestionEntity, SubjectEntity, TopicEntity } from '../../../domain/entities/index.js'

export interface FindSubjectByIdRepository {
  findById(id: string): Promise<SubjectEntity | null>
}

export interface FindTopicByIdRepository {
  findById(id: string): Promise<TopicEntity | null>
}

export interface CreateQuestionWithTransactionRepository<T = any> {
  createWithTransaction(question: QuestionEntity, trx: T): Promise<void>
}

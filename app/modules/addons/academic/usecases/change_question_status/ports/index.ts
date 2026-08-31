import { QuestionEntity } from '../../../domain/entities/index.js'

export interface FindQuestionByIdRepository {
  findById(id: string): Promise<QuestionEntity | null>
}

export interface UpdateQuestionStatusRepository {
  updateStatus(question: QuestionEntity): Promise<void>
}

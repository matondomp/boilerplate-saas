import { QuestionEntity, QuestionRevisionEntity } from '../../../domain/entities/index.js'

export interface FindQuestionByIdRepository {
  findById(id: string): Promise<QuestionEntity | null>
}

export interface UpdateQuestionWithTransactionRepository<T = any> {
  updateWithTransaction(
    question: QuestionEntity,
    revision: QuestionRevisionEntity | null,
    trx: T
  ): Promise<void>
}

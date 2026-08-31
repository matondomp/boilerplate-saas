import { TransactionAdapterImpl } from '#app/db/adapters/transaction_adapter_impl'
import { CreateQuestionController } from '../controllers/index.js'
import { CreateQuestionUseCaseImpl } from '../../../usecases/create_question/index.js'
import { QuestionRepositoriesImpl, SubjectTopicRepositoriesImpl } from '../../infra/db/repositories/index.js'

export const makeCreateQuestionControllerFactory = (): CreateQuestionController => {
  const repository = new QuestionRepositoriesImpl()
  const subjectTopicRepository = new SubjectTopicRepositoriesImpl()

  return new CreateQuestionController(
    new CreateQuestionUseCaseImpl(
      subjectTopicRepository as any,
      subjectTopicRepository as any,
      repository,
      new TransactionAdapterImpl()
    )
  )
}

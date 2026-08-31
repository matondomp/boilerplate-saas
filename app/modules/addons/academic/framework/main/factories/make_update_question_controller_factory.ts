import { EventDispatcher } from '#core/domain/index'
import { TransactionAdapterImpl } from '#app/db/adapters/transaction_adapter_impl'
import { UpdateQuestionController } from '../controllers/index.js'
import { UpdateQuestionUseCaseImpl } from '../../../usecases/update_question/index.js'
import { QuestionRepositoriesImpl } from '../../infra/db/repositories/index.js'

export const makeUpdateQuestionControllerFactory = (): UpdateQuestionController => {
  const repository = new QuestionRepositoriesImpl()

  return new UpdateQuestionController(
    new UpdateQuestionUseCaseImpl(
      repository,
      repository,
      new TransactionAdapterImpl(),
      EventDispatcher.getInstance()
    )
  )
}

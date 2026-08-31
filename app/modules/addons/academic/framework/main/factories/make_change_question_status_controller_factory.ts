import { EventDispatcher } from '#core/domain/index'
import { ChangeQuestionStatusController } from '../controllers/index.js'
import { ChangeQuestionStatusUseCaseImpl } from '../../../usecases/change_question_status/index.js'
import { QuestionRepositoriesImpl } from '../../infra/db/repositories/index.js'

export const makeChangeQuestionStatusControllerFactory =
  (): ChangeQuestionStatusController => {
    const repository = new QuestionRepositoriesImpl()

    return new ChangeQuestionStatusController(
      new ChangeQuestionStatusUseCaseImpl(repository, repository, EventDispatcher.getInstance())
    )
  }

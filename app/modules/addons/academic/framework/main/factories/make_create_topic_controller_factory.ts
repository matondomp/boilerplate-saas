import { CreateTopicController } from '../controllers/index.js'
import { CreateTopicUseCaseImpl } from '../../../usecases/create_topic/index.js'
import { SubjectTopicRepositoriesImpl } from '../../infra/db/repositories/index.js'

export const makeCreateTopicControllerFactory = (): CreateTopicController => {
  const repository = new SubjectTopicRepositoriesImpl()

  return new CreateTopicController(
    new CreateTopicUseCaseImpl(repository, repository, repository)
  )
}

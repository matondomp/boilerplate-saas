import { CreateSubjectController } from '../controllers/index.js'
import { CreateSubjectUseCaseImpl } from '../../../usecases/create_subject/index.js'
import { SubjectTopicRepositoriesImpl } from '../../infra/db/repositories/index.js'

export const makeCreateSubjectControllerFactory = (): CreateSubjectController => {
  const repository = new SubjectTopicRepositoriesImpl()

  return new CreateSubjectController(new CreateSubjectUseCaseImpl(repository, repository))
}

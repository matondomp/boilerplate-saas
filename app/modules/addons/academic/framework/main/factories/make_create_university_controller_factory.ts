import { EventDispatcher } from '#core/domain/index'
import { CreateUniversityController } from '../controllers/index.js'
import { CreateUniversityUseCaseImpl } from '../../../usecases/create_university/index.js'
import { UniversityRepositoriesImpl } from '../../infra/db/repositories/index.js'

export const makeCreateUniversityControllerFactory = (): CreateUniversityController => {
  const repository = new UniversityRepositoriesImpl()

  return new CreateUniversityController(
    new CreateUniversityUseCaseImpl(repository, repository, EventDispatcher.getInstance())
  )
}

import { UpdateUniversityController } from '../controllers/index.js'
import { UpdateUniversityUseCaseImpl } from '../../../usecases/update_university/update_university_usecase_impl.js'
import { UniversityRepositoriesImpl } from '../../infra/db/repositories/university_repositories_impl.js'

export const makeUpdateUniversityControllerFactory = (): UpdateUniversityController => {
  const repository = new UniversityRepositoriesImpl()
  const useCase = new UpdateUniversityUseCaseImpl(repository, repository, repository)
  return new UpdateUniversityController(useCase)
}

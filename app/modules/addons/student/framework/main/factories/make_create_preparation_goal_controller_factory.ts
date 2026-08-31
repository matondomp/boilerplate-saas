import { CreatePreparationGoalController } from '../controllers/index.js'
import { CreatePreparationGoalUseCaseImpl } from '../../../usecases/create_preparation_goal/create_preparation_goal_usecase_impl.js'
import {
  StudentRepositoriesImpl,
  PreparationGoalRepositoriesImpl,
  AcademicLookupRepositoriesImpl,
} from '../../infra/db/repositories/index.js'

export const makeCreatePreparationGoalControllerFactory = (): CreatePreparationGoalController => {
  const studentRepo = new StudentRepositoriesImpl()
  const goalRepo = new PreparationGoalRepositoriesImpl()
  const academicLookupRepo = new AcademicLookupRepositoriesImpl()
  const dummyEventDispatcher = { publish: async () => {} } as any

  const useCase = new CreatePreparationGoalUseCaseImpl(
    studentRepo,
    studentRepo,
    academicLookupRepo,
    academicLookupRepo,
    goalRepo,
    goalRepo,
    dummyEventDispatcher
  )

  return new CreatePreparationGoalController(useCase)
}

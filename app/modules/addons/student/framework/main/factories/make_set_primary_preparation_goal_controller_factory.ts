import { SetPrimaryPreparationGoalController } from '../controllers/index.js'
import { SetPrimaryPreparationGoalUseCaseImpl } from '../../../usecases/set_primary_preparation_goal/set_primary_preparation_goal_usecase_impl.js'
import { StudentRepositoriesImpl, PreparationGoalRepositoriesImpl } from '../../infra/db/repositories/index.js'

export const makeSetPrimaryPreparationGoalControllerFactory = (): SetPrimaryPreparationGoalController => {
  const studentRepo = new StudentRepositoriesImpl()
  const goalRepo = new PreparationGoalRepositoriesImpl()
  const dummyEventDispatcher = { publish: async () => {} } as any
  const useCase = new SetPrimaryPreparationGoalUseCaseImpl(studentRepo, goalRepo, goalRepo, dummyEventDispatcher)
  return new SetPrimaryPreparationGoalController(useCase)
}

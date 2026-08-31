import { PausePreparationGoalController } from '../controllers/pause_preparation_goal_controller.js'
import { PausePreparationGoalUseCaseImpl } from '../../../usecases/manage_goal_lifecycle/pause_preparation_goal_usecase_impl.js'
import { StudentRepositoriesImpl, PreparationGoalRepositoriesImpl } from '../../infra/db/repositories/index.js'

export const makePausePreparationGoalControllerFactory = (): PausePreparationGoalController => {
  const studentRepo = new StudentRepositoriesImpl()
  const goalRepo = new PreparationGoalRepositoriesImpl()
  const useCase = new PausePreparationGoalUseCaseImpl(studentRepo, goalRepo, goalRepo)
  return new PausePreparationGoalController(useCase)
}

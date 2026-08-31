import { ResumePreparationGoalController } from '../controllers/resume_preparation_goal_controller.js'
import { ResumePreparationGoalUseCaseImpl } from '../../../usecases/manage_goal_lifecycle/resume_preparation_goal_usecase_impl.js'
import { StudentRepositoriesImpl, PreparationGoalRepositoriesImpl } from '../../infra/db/repositories/index.js'

export const makeResumePreparationGoalControllerFactory = (): ResumePreparationGoalController => {
  const studentRepo = new StudentRepositoriesImpl()
  const goalRepo = new PreparationGoalRepositoriesImpl()
  const useCase = new ResumePreparationGoalUseCaseImpl(studentRepo, goalRepo, goalRepo)
  return new ResumePreparationGoalController(useCase)
}

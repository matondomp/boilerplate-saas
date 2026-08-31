import { ListStudentGoalsController } from '../controllers/index.js'
import { ListStudentGoalsUseCaseImpl } from '../../../usecases/list_student_goals/list_student_goals_usecase_impl.js'
import { StudentRepositoriesImpl, PreparationGoalRepositoriesImpl } from '../../infra/db/repositories/index.js'

export const makeListStudentGoalsControllerFactory = (): ListStudentGoalsController => {
  const studentRepo = new StudentRepositoriesImpl()
  const goalRepo = new PreparationGoalRepositoriesImpl()
  const useCase = new ListStudentGoalsUseCaseImpl(studentRepo, goalRepo)
  return new ListStudentGoalsController(useCase)
}

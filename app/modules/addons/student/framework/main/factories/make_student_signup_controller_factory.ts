import { StudentSignupController } from '../controllers/student_signup_controller.js'
import { StudentSignupUseCaseImpl } from '../../../usecases/student_signup/student_signup_usecase_impl.js'
import { StudentSignupRepositoryImpl } from '../../infra/db/repositories/student_signup_repository_impl.js'

export const makeStudentSignupControllerFactory = (): StudentSignupController => {
  const repo = new StudentSignupRepositoryImpl()
  const useCase = new StudentSignupUseCaseImpl(repo, repo)
  return new StudentSignupController(useCase)
}

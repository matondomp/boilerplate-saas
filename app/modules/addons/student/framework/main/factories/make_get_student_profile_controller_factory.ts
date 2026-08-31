import { GetStudentProfileController } from '../controllers/get_student_profile_controller.js'
import { GetStudentProfileUseCaseImpl } from '../../../usecases/manage_student_profile/get_student_profile_usecase_impl.js'
import { StudentRepositoriesImpl, StudentProfileRepositoriesImpl } from '../../infra/db/repositories/index.js'

export const makeGetStudentProfileControllerFactory = (): GetStudentProfileController => {
  const studentRepo = new StudentRepositoriesImpl()
  const profileRepo = new StudentProfileRepositoriesImpl()
  const useCase = new GetStudentProfileUseCaseImpl(studentRepo, profileRepo, profileRepo)
  return new GetStudentProfileController(useCase)
}

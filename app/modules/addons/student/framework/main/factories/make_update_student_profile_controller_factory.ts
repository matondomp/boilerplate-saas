import { UpdateStudentProfileController } from '../controllers/update_student_profile_controller.js'
import { UpdateStudentProfileUseCaseImpl } from '../../../usecases/manage_student_profile/update_student_profile_usecase_impl.js'
import { StudentRepositoriesImpl, StudentProfileRepositoriesImpl } from '../../infra/db/repositories/index.js'

export const makeUpdateStudentProfileControllerFactory = (): UpdateStudentProfileController => {
  const studentRepo = new StudentRepositoriesImpl()
  const profileRepo = new StudentProfileRepositoriesImpl()
  const useCase = new UpdateStudentProfileUseCaseImpl(studentRepo, profileRepo, profileRepo)
  return new UpdateStudentProfileController(useCase)
}

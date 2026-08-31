import { UpdateStudentStatusController } from '../controllers/update_student_status_controller.js'
import { UpdateStudentStatusUseCaseImpl } from '../../../usecases/admin/update_student_status_usecase_impl.js'
import { StudentRepositoriesImpl } from '../../infra/db/repositories/index.js'

export const makeUpdateStudentStatusControllerFactory = (): UpdateStudentStatusController => {
  const studentRepo = new StudentRepositoriesImpl()
  const useCase = new UpdateStudentStatusUseCaseImpl(studentRepo, studentRepo)
  return new UpdateStudentStatusController(useCase)
}

import { ListAdminStudentsController } from '../controllers/list_admin_students_controller.js'
import { ListAdminStudentsUseCaseImpl } from '../../../usecases/admin/list_admin_students_usecase_impl.js'
import { StudentRepositoriesImpl } from '../../infra/db/repositories/index.js'

export const makeListAdminStudentsControllerFactory = (): ListAdminStudentsController => {
  const studentRepo = new StudentRepositoriesImpl()
  const useCase = new ListAdminStudentsUseCaseImpl(studentRepo)
  return new ListAdminStudentsController(useCase)
}

import { ShowAdminStudentsPageController } from '../controllers/show_admin_students_page_controller.js'

export const makeShowAdminStudentsPageControllerFactory = (): ShowAdminStudentsPageController => {
  return new ShowAdminStudentsPageController()
}

import { ShowAdminStudentDetailsPageController } from '../controllers/show_admin_student_details_page_controller.js'

export const makeShowAdminStudentDetailsPageControllerFactory = (): ShowAdminStudentDetailsPageController => {
  return new ShowAdminStudentDetailsPageController()
}

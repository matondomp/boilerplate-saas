import { StudentSwaggerController } from '../controllers/student_swagger_controller.js'

export const makeStudentSwaggerControllerFactory = (): StudentSwaggerController => {
  return new StudentSwaggerController()
}

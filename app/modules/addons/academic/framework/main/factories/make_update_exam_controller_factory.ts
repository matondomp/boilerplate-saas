import { UpdateExamController } from '../controllers/update_exam_controller.js'

export function makeUpdateExamControllerFactory() {
  return new UpdateExamController()
}

import { UpdateCourseController } from '../controllers/index.js'

export const makeUpdateCourseControllerFactory = (): UpdateCourseController => {
  return new UpdateCourseController()
}

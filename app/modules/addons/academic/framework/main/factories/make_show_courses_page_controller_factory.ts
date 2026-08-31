import { ShowCoursesPageController } from '../controllers/index.js'

export const makeShowCoursesPageControllerFactory = (): ShowCoursesPageController => {
  return new ShowCoursesPageController()
}

import { ChangeCourseStatusController } from '../controllers/index.js'

export const makeChangeCourseStatusControllerFactory = (): ChangeCourseStatusController => {
  return new ChangeCourseStatusController()
}

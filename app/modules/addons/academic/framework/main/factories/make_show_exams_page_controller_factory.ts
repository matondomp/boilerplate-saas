import { ShowExamsPageController } from '../controllers/index.js'

export const makeShowExamsPageControllerFactory = (): ShowExamsPageController => {
  return new ShowExamsPageController()
}

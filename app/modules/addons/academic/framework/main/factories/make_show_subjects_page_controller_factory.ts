import { ShowSubjectsPageController } from '../controllers/index.js'

export const makeShowSubjectsPageControllerFactory = (): ShowSubjectsPageController => {
  return new ShowSubjectsPageController()
}

import { ShowTopicsPageController } from '../controllers/index.js'

export const makeShowTopicsPageControllerFactory = (): ShowTopicsPageController => {
  return new ShowTopicsPageController()
}

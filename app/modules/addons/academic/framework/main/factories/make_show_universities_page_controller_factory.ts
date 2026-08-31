import { ShowUniversitiesPageController } from '../controllers/index.js'

export const makeShowUniversitiesPageControllerFactory = (): ShowUniversitiesPageController => {
  return new ShowUniversitiesPageController()
}

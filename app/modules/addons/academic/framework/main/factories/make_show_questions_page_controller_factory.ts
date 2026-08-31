import { ShowQuestionsPageController } from '../controllers/index.js'

export const makeShowQuestionsPageControllerFactory = (): ShowQuestionsPageController => {
  return new ShowQuestionsPageController()
}

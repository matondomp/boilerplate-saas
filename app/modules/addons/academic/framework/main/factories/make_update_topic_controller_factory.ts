import { UpdateTopicController } from '../controllers/index.js'

export const makeUpdateTopicControllerFactory = (): UpdateTopicController => {
  return new UpdateTopicController()
}

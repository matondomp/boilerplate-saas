import { UpdateSubjectController } from '../controllers/index.js'

export const makeUpdateSubjectControllerFactory = (): UpdateSubjectController => {
  return new UpdateSubjectController()
}

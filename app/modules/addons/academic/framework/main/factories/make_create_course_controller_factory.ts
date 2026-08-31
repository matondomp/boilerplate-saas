import { EventDispatcher } from '#core/domain/index'
import { CreateCourseController } from '../controllers/index.js'
import { CreateCourseUseCaseImpl } from '../../../usecases/create_course/index.js'
import { CourseRepositoriesImpl } from '../../infra/db/repositories/index.js'

export const makeCreateCourseControllerFactory = (): CreateCourseController => {
  const repository = new CourseRepositoriesImpl()

  return new CreateCourseController(
    new CreateCourseUseCaseImpl(
      repository,
      repository,
      repository,
      EventDispatcher.getInstance()
    )
  )
}

import { CreateExamController } from '../controllers/index.js'
import { CreateExamUseCaseImpl } from '../../../usecases/create_exam/index.js'
import { ExamRepositoriesImpl } from '../../infra/db/repositories/index.js'

export const makeCreateExamControllerFactory = (): CreateExamController => {
  const repository = new ExamRepositoriesImpl()

  return new CreateExamController(
    new CreateExamUseCaseImpl(repository, repository, repository)
  )
}

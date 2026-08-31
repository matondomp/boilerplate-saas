import { EventDispatcher } from '#core/domain/index'
import { CreatePreparationGoalController } from '../controllers/index.js'
import { CreatePreparationGoalUseCaseImpl } from '../../../usecases/create_preparation_goal/index.js'
import { PreparationGoalRepositoriesImpl } from '../../infra/db/repositories/index.js'

export const makeCreatePreparationGoalControllerFactory =
  (): CreatePreparationGoalController => {
    const repository = new PreparationGoalRepositoriesImpl()

    return new CreatePreparationGoalController(
      new CreatePreparationGoalUseCaseImpl(
        repository,
        repository,
        repository,
        repository,
        EventDispatcher.getInstance()
      )
    )
  }

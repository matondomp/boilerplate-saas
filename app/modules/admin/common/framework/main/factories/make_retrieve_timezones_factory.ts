import { FindTimezonesRepositoryImpl } from '#shared/framework/infra/db/repositories/in_memory/find_timezones_repository_impl'
import { RetrieveTimezonesUseCaseImpl } from '../../../usecases/retrieve_timezones/retrieve_timezones_usecase_impl.js'
import { RetrieveTimezonesController } from '../controllers/retrive_timezones_controller.js'

export const makeRetrieveTimezonesFactory = () => {
  return new RetrieveTimezonesController(
    new RetrieveTimezonesUseCaseImpl(new FindTimezonesRepositoryImpl())
  )
}

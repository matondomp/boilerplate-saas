import { RetrieveUserActivitiesController } from '#modules/admin/common/framework/main/controllers/retrieve_user_activities_controller'
import { RetrieveNewestActivitiesUseCaseImpl } from '#modules/admin/common/usecases/retrieve_newest_activities/index'
import { RetrieveNewestActivitiesRepositoryImpl } from '#modules/admin/common/framework/infra/index'
import { DateAdapterImpl, FindUsernameRepositoryImpl } from '#shared/framework/infra/index'

export const makeRetrieveUserActivitiesControllerFactory = () => {
  return new RetrieveUserActivitiesController(
    new RetrieveNewestActivitiesUseCaseImpl(
      new FindUsernameRepositoryImpl(),
      new RetrieveNewestActivitiesRepositoryImpl(),
      new DateAdapterImpl()
    )
  )
}

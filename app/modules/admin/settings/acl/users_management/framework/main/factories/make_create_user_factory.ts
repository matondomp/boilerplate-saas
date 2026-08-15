import { CreateUserController } from '#modules/admin/settings/acl/users_management/framework/main/controllers/create_user_controller'
import { CreateUserUseCaseImpl } from '#modules/admin/settings/acl/users_management/usecases/create_user/create_user_usecase_impl'
import { GenerateRandomPasswordServiceImpl } from '#modules/admin/settings/acl/users_management/framework/infra/services/generate_random_password_service'
import { PersistUserRepositoryImpl } from '#modules/admin/settings/acl/users_management/framework/infra/db/repositories/persist_user_repository_impl'
import { EventDispatcher } from '#core/domain/index'
import { FindUsernameEmailRepositoryImpl } from '#shared/framework/infra/index'

export const makeCreateUserFactory = (): CreateUserController => {
  return new CreateUserController(
    new CreateUserUseCaseImpl(
      new FindUsernameEmailRepositoryImpl(),
      new GenerateRandomPasswordServiceImpl(),
      new PersistUserRepositoryImpl(),
      EventDispatcher.getInstance()
    )
  )
}

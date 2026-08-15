import { ShowAppSettingPageController } from '../controllers/index.js'
import { FindAppSettingColorUseCaseImpl } from '../../../usecases/find_app_setting/find_app_setting_usecase_impl.js'
import { FindAppSettingRepositoryImpl } from '../../infra/db/repositories/find_app_setting_repository_impl.js'
import { AppSettingColorMapper } from '../../infra/index.js'

export const makeShowAppSettingFactory = () => {
  return new ShowAppSettingPageController(
    new FindAppSettingColorUseCaseImpl(
      new FindAppSettingRepositoryImpl(new AppSettingColorMapper())
    )
  )
}

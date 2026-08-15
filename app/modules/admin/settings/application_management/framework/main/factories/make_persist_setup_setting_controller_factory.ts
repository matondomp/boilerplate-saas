import { EventDispatcher } from '#core/domain/index'
import { PersistAppSettingUseCaseImpl } from '../../../usecases/persist_app_setting/index.js'
import { PersistAppSettingController } from '../controllers/index.js'
import {
  PersistAppSettingRepositoryImpl,
  AppSettingColorMapper,
  FindAppSettingRepositoryImpl,
} from '../../infra/index.js'
import { UploadServiceLocalImpl } from '#modules/shared/framework/infra/index'

export const makePersistAppSettingControllerFactory = (): PersistAppSettingController => {
  return new PersistAppSettingController(
    new PersistAppSettingUseCaseImpl(
      new FindAppSettingRepositoryImpl(new AppSettingColorMapper()),
      new PersistAppSettingRepositoryImpl(),
      EventDispatcher.getInstance()
    ),
    new UploadServiceLocalImpl()
  )
}

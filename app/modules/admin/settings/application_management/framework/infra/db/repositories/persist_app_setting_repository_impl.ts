import { PersistAppSettingRepository } from '../../../../usecases/persist_app_setting/index.js'
import { AppSettingColorMapper } from '../mappers/index.js'
import { ApplicationSettingsEntity } from '../../../../domain/entities/application_settings_entity.js'
import { CoreApplicationSettings } from '#shared/framework/infra/index'

export class PersistAppSettingRepositoryImpl implements PersistAppSettingRepository {
  constructor(
    private readonly appSettingMapper: AppSettingColorMapper = new AppSettingColorMapper()
  ) {}

  async persist(appSetting: ApplicationSettingsEntity): Promise<void> {
    const lastId = await CoreApplicationSettings.query().whereNull('deleted_at').firstOrFail()

    lastId.delete()
    lastId.save()
    const appSettingColor = await this.appSettingMapper.toPersistence(appSetting)

    await appSettingColor.save()
  }
}

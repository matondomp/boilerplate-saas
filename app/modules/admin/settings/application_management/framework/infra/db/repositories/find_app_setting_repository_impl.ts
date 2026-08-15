import { CoreApplicationSettings } from '#shared/framework/infra/index'
import { ApplicationSettingsEntity } from '../../../../domain/index.js'
import { FindAppSettingRepository } from '../../../../usecases/find_app_setting/ports/find_app_setting_repository.js'
import { AppSettingColorMapper } from '../mappers/index.js'

export class FindAppSettingRepositoryImpl implements FindAppSettingRepository {
  constructor(private readonly appSettingMapper: AppSettingColorMapper) {}
  async findAppSetting(): Promise<ApplicationSettingsEntity> {
    const applicationSetting = await CoreApplicationSettings.query()
      .whereNull('deleted_at')
      .firstOrFail()

    return this.appSettingMapper.toDomain(applicationSetting)
  }
}

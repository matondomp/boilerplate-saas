import { ApplicationSettingsEntity } from '../../../domain/entities/application_settings_entity.js'

export interface FindAppSettingRepository {
  findAppSetting(): Promise<ApplicationSettingsEntity>
}

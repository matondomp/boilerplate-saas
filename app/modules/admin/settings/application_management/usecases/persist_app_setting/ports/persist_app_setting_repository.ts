import { ApplicationSettingsEntity } from '../../../domain/entities/application_settings_entity.js'

export interface PersistAppSettingRepository {
  persist(applicationSetting: ApplicationSettingsEntity): Promise<void>
}

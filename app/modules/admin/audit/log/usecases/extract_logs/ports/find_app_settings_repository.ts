import { ApplicationSettingsEntity } from '#modules/admin/settings/application_management/domain/index'

export interface FindAppSettingsRepository {
  findAppSetting(): Promise<ApplicationSettingsEntity>
}

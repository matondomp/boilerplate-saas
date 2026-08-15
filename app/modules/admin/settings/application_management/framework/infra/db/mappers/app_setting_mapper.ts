import { Mapper, UniqueEntityID } from '#core/domain/index'
import { CoreApplicationSettings } from '#shared/framework/infra/index'
import { ApplicationSettingsEntity } from '../../../../domain/entities/application_settings_entity.js'
import { Color } from '../../../../domain/value_objects/colors.js'

export class AppSettingColorMapper extends Mapper<
  ApplicationSettingsEntity,
  CoreApplicationSettings
> {
  toDomain(appSettingModel: CoreApplicationSettings): ApplicationSettingsEntity {
    const appColorPrimaryOrError = Color.create({ value: appSettingModel.appColorPrimary })

    if (appColorPrimaryOrError.isLeft()) {
      throw new Error(appColorPrimaryOrError.value.errorMessage)
    }

    const appColorSecondaryOrError = Color.create({ value: appSettingModel.appColorSecondary })

    if (appColorSecondaryOrError.isLeft()) {
      throw new Error(appColorSecondaryOrError.value.errorMessage)
    }

    const appBackgroundPrimaryOrError = Color.create({
      value: appSettingModel.appBackgroundPrimaryColor,
    })

    if (appBackgroundPrimaryOrError.isLeft()) {
      throw new Error(appBackgroundPrimaryOrError.value.errorMessage)
    }

    const appBackgroundSecondaryOrError = Color.create({
      value: appSettingModel.appBackgroundSecondaryColor,
    })
    if (appBackgroundSecondaryOrError.isLeft()) {
      throw new Error(appBackgroundSecondaryOrError.value.errorMessage)
    }

    const appSettingColors = ApplicationSettingsEntity.hydrate(
      new UniqueEntityID(appSettingModel.id),
      {
        appName: appSettingModel.appName,
        appDesc: appSettingModel.appDesc,
        imageUrl: appSettingModel.imageUrl,
        appColorPrimary: appColorPrimaryOrError.value,
        appColorSecondary: appColorSecondaryOrError.value,
        appBackgroundPrimaryColor: appBackgroundPrimaryOrError.value,
        appBackgroundSecondaryColor: appBackgroundSecondaryOrError.value,
      }
    )

    if (appSettingColors.isLeft()) {
      throw new Error(appSettingColors.value.errorMessage)
    }
    return appSettingColors.value
  }
  async toPersistence(
    _applicationSettingsEntity: ApplicationSettingsEntity
  ): Promise<CoreApplicationSettings> {
    let appSettingModel: CoreApplicationSettings = new CoreApplicationSettings()
    appSettingModel.id = _applicationSettingsEntity.id.toString()
    appSettingModel.appName = _applicationSettingsEntity.appName
    appSettingModel.appDesc = _applicationSettingsEntity.appDesc
    appSettingModel.imageUrl = _applicationSettingsEntity.imageUrl || null
    appSettingModel.appColorPrimary = _applicationSettingsEntity.appColorPrimary
    appSettingModel.appColorSecondary = _applicationSettingsEntity.appColorSecondary
    appSettingModel.appBackgroundPrimaryColor = _applicationSettingsEntity.appBackgroundPrimaryColor
    appSettingModel.appBackgroundSecondaryColor =
      _applicationSettingsEntity.appBackgroundSecondaryColor

    return appSettingModel
  }
}

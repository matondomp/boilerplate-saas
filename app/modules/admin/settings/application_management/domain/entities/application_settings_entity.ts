import { Either, Entity, left, Options, right, UniqueEntityID } from '#core/domain/index'
import { AppSettingInputErrors } from '../errors/app_setting_input_errors.js'
import { Color } from '../value_objects/colors.js'

interface ApplicationSettingsProps {
  appName: string
  appDesc: string
  imageUrl?: string | null
  appColorPrimary: Color
  appColorSecondary: Color
  appBackgroundPrimaryColor: Color
  appBackgroundSecondaryColor: Color
}

type AppSettingEntityError =
  | AppSettingInputErrors.AppColorRequiredError
  | AppSettingInputErrors.AppNameRequiredError
  | AppSettingInputErrors.AppDescRequiredError
  | AppSettingInputErrors.HexadecimalIsNotValid

export class ApplicationSettingsEntity extends Entity<ApplicationSettingsProps> {
  get appName(): string {
    return this.props.appName
  }

  get appDesc(): string {
    return this.props.appDesc
  }

  get imageUrl(): string | undefined | null {
    return this.props.imageUrl
  }

  get appColorPrimary(): string {
    return this.props.appColorPrimary.value
  }

  get appColorSecondary(): string {
    return this.props.appColorSecondary.value
  }
  get appBackgroundPrimaryColor(): string {
    return this.props.appBackgroundPrimaryColor.value
  }

  get appBackgroundSecondaryColor(): string {
    return this.props.appBackgroundSecondaryColor.value
  }
  changeAppName(name: string): void {
    this.props.appName = name
  }

  changeAppDesc(description: string): void {
    this.props.appDesc = description
  }

  changeAppColorPrimary(primaryColor: Color): void {
    this.props.appColorPrimary = primaryColor
  }

  changeAppColorSecondary(secondColor: Color): void {
    this.props.appColorSecondary = secondColor
  }

  changeAppBackgroundPrimaryColor(backgroundPrimaryColor: Color): void {
    this.props.appBackgroundPrimaryColor = backgroundPrimaryColor
  }

  changeAppBackgroundSecondaryColor(backgroundSecondaryColor: Color): void {
    this.props.appBackgroundSecondaryColor = backgroundSecondaryColor
  }

  delete(): void | undefined {
    this._deletedAt = new Date()
  }

  validateHexadecimalInput(input: string) {
    var hexRegex = /^[0-9A-Fa-f]+$/
    return hexRegex.test(input)
  }

  validate(): Either<AppSettingEntityError, boolean> {
    if (!this.props.appName) {
      return left(new AppSettingInputErrors.AppNameRequiredError())
    }
    if (!this.props.appDesc) {
      return left(new AppSettingInputErrors.AppDescRequiredError())
    }
    if (!this.props.appColorPrimary) {
      return left(new AppSettingInputErrors.AppColorRequiredError())
    }

    return right(true)
  }

  static create(
    appName: string,
    appDesc: string,
    imageUrl: string | undefined | null,
    appColorPrimary: Color,
    appColorSecondary: Color,
    appBackgroundPrimaryColor: Color,
    appBackgroundSecondaryColor: Color
  ): Either<AppSettingInputErrors.AppNameRequiredError, ApplicationSettingsEntity> {
    if (appName.trim().length === 0) {
      return left(new AppSettingInputErrors.AppNameRequiredError())
    }

    if (appDesc.trim().length === 0) {
      return left(new AppSettingInputErrors.AppDescRequiredError())
    }

    const appSetting = new ApplicationSettingsEntity({
      appName,
      appDesc,
      imageUrl,
      appColorPrimary,
      appColorSecondary,
      appBackgroundPrimaryColor,
      appBackgroundSecondaryColor,
    })

    return right(appSetting)
  }

  static hydrate(
    id: UniqueEntityID,
    props: ApplicationSettingsProps,
    options?: Options
  ): Either<AppSettingEntityError, ApplicationSettingsEntity> {
    const applicationSettingEntity = new ApplicationSettingsEntity(props, id, options)

    const validation = applicationSettingEntity.validate()

    if (validation.isLeft()) {
      return left(validation.value)
    }

    return right(applicationSettingEntity)
  }
}

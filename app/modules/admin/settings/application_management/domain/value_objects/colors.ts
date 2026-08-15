import { Either, left, right, ValueObject } from '#core/domain/index'
import { AppSettingInputErrors } from '../errors/app_setting_input_errors.js'

interface AppColorsProp {
  value: string
}

export class Color extends ValueObject<AppColorsProp> {
  protected constructor(protected readonly prop: AppColorsProp) {
    super(prop)
  }

  private validate() {
    var hexRegex = /^#([0-9a-f]{3}){1,2}$/i

    return hexRegex.test(this.props.value)
  }

  static create(props: AppColorsProp): Either<AppSettingInputErrors.AppColorRequiredError, Color> {
    if (props.value.trim().length === 0) {
      return left(new AppSettingInputErrors.AppColorRequiredError())
    }

    const color = new Color(props)

    if (!color.validate()) {
      return left(new AppSettingInputErrors.HexadecimalIsNotValid())
    }

    return right(color)
  }

  get value(): string {
    return this.props.value
  }
}

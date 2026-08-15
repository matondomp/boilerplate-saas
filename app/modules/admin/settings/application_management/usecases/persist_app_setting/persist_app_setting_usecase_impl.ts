import { IEventDispatcher, left, right } from '#core/domain/index'
import {
  PersistAppSettingUseCase,
  PersistAppSettingUseCaseInput,
} from '../../domain/usecases/persist_app_setting/index.js'
import { PersistAppSettingRepository } from './ports/index.js'
import { ApplicationSettingsEntity } from '../../domain/entities/application_settings_entity.js'
import { AppSettingModifiedEvent } from '../../domain/events/app_setting_modified.js'
import { CreatedAppSettingResult } from '../../domain/usecases/persist_app_setting/persist_app_setting_usecase.js'
import { Color } from '../../domain/value_objects/colors.js'
import { AppSettingInputErrors } from '../../domain/errors/app_setting_input_errors.js'
import { FindAppSettingRepository } from '../find_app_setting/ports/find_app_setting_repository.js'

export class PersistAppSettingUseCaseImpl implements PersistAppSettingUseCase {
  constructor(
    private readonly findAppSettingRepository: FindAppSettingRepository,
    private readonly persistAppSettingRepository: PersistAppSettingRepository,
    private readonly eventDispatcher: IEventDispatcher
  ) {}
  async perform(input: PersistAppSettingUseCaseInput): Promise<CreatedAppSettingResult> {
    const appColorPrimaryOrError = Color.create({ value: input.appColorPrimary })
    const appColorSecundaryOrError = Color.create({ value: input.appColorSecondary })
    const appBackgroundColorPrimaryOrError = Color.create({
      value: input.appBackgroundPrimaryColor,
    })
    const appBackgroundColorSecundaryOrError = Color.create({
      value: input.appBackgroundSecondaryColor,
    })

    if (
      appColorPrimaryOrError.isLeft() ||
      appColorSecundaryOrError.isLeft() ||
      appBackgroundColorPrimaryOrError.isLeft() ||
      appBackgroundColorSecundaryOrError.isLeft()
    ) {
      return left(new AppSettingInputErrors.AppColorRequiredError())
    }

    const createAppSettingOrError = ApplicationSettingsEntity.create(
      input.appName,
      input.appDesc,
      input.imageUrl,
      appColorPrimaryOrError.value,
      appColorSecundaryOrError.value,
      appBackgroundColorPrimaryOrError.value,
      appBackgroundColorSecundaryOrError.value
    )

    if (createAppSettingOrError.isLeft()) {
      return left(createAppSettingOrError.value)
    }
    const lastId = await this.findAppSettingRepository.findAppSetting()

    await this.persistAppSettingRepository.persist(createAppSettingOrError.value)

    this.eventDispatcher.publish(
      new AppSettingModifiedEvent({
        lastId: lastId.id,
        currentId: createAppSettingOrError.value.id,
      })
    )

    return right(true)
  }
}

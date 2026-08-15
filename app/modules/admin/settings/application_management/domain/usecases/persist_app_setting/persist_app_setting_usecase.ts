import { Either, UseCase } from '#core/domain/index'
import { AppSettingInputErrors } from '../../errors/app_setting_input_errors.js'
import { PersistAppSettingUseCaseInput } from './persist_app_setting_usecase_input.js'

export type CreatedAppSettingResult = Either<AppSettingInputErrors.AppNameRequiredError, boolean>

export type PersistAppSettingUseCase = UseCase<
  PersistAppSettingUseCaseInput,
  CreatedAppSettingResult
>

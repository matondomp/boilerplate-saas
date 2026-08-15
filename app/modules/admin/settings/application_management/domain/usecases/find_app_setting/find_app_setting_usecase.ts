import { UseCaseWithoutInput } from '#core/domain/index'
import { AppSettingUseCaseOutput } from './find_app_setting_usecase_output.js'

export type FindAppSettingUseCase = UseCaseWithoutInput<AppSettingUseCaseOutput>

import { AppSettingUseCaseOutput } from '../../domain/index.js'
import { FindAppSettingUseCase } from '../../domain/usecases/find_app_setting/find_app_setting_usecase.js'
import { FindAppSettingRepository } from './ports/find_app_setting_repository.js'

export class FindAppSettingColorUseCaseImpl implements FindAppSettingUseCase {
  constructor(private readonly findAppSettingRepository: FindAppSettingRepository) {}
  async perform(): Promise<AppSettingUseCaseOutput> {
    const appSetting = await this.findAppSettingRepository.findAppSetting().then((a) => {
      return {
        appName: a?.appName,
        appDesc: a?.appDesc,
        imageUrl: a?.imageUrl,
        appColorPrimary: a?.appColorPrimary,
        appColorSecondary: a?.appColorSecondary,
        appBackgroundPrimaryColor: a?.appBackgroundPrimaryColor,
        appBackgroundSecondaryColor: a?.appBackgroundSecondaryColor,
      }
    })

    return { appSetting }
  }
}

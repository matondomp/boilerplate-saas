import { test } from '@japa/runner'
import { ApplicationSettingsEntity, Color } from '../../domain/index.js'
import { FindAppSettingColorUseCaseImpl } from './find_app_setting_usecase_impl.js'
import { FindAppSettingRepository } from './ports/index.js'
import Sinon from 'sinon'

interface SutTypes {
  sut: FindAppSettingColorUseCaseImpl
  findAppSettingRepository: FindAppSettingRepository
}

const makeFindAppSettingRepository = (): FindAppSettingRepository => {
  class FindAppSettingRepositoryMock implements FindAppSettingRepository {
    async findAppSetting(): Promise<ApplicationSettingsEntity> {
      const color = Color.create({ value: '#448bff' })

      if (color.isLeft()) {
        throw new Error()
      }

      const appSettings = ApplicationSettingsEntity.create(
        'appName',
        'appDesc',
        null,
        color.value,
        color.value,
        color.value,
        color.value
      )
      if (appSettings.isLeft()) {
        throw new Error()
      }

      return appSettings.value
    }
  }
  return new FindAppSettingRepositoryMock()
}
const makeSut = (): SutTypes => {
  const findAppSettingRepository = makeFindAppSettingRepository()

  const sut = new FindAppSettingColorUseCaseImpl(findAppSettingRepository)
  return { sut, findAppSettingRepository }
}

test.group('Find App settings usecase implementation unit test', () => {
  test('should return a Appsettings', async ({ expect }) => {
    const { sut, findAppSettingRepository } = makeSut()

    const findAppSettingSpy = Sinon.spy(findAppSettingRepository, 'findAppSetting')

    await sut.perform()

    expect(findAppSettingSpy.callCount).toEqual(1)
  })
})

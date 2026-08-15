import {
  ApplicationSettingsEntity,
  Color,
  PersistAppSettingUseCaseInput,
} from '../../domain/index.js'
import { FindAppSettingRepository } from '../find_app_setting/ports/find_app_setting_repository.js'
import { PersistAppSettingRepository } from './ports/index.js'
import { PersistAppSettingUseCase } from '../../domain/usecases/persist_app_setting/persist_app_setting_usecase.js'
import { PersistAppSettingUseCaseImpl } from './persist_app_setting_usecase_impl.js'
import { EventDispatcher } from '#core/domain/events/event_dispatcher'
import { test } from '@japa/runner'

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

const mockPersistAppSettingRepository = (): PersistAppSettingRepository => {
  return new (class implements PersistAppSettingRepository {
    async persist(): Promise<void> {
      return Promise.resolve()
    }
  })()
}

interface SutTypes {
  sut: PersistAppSettingUseCase
  findAppSettingRepository: FindAppSettingRepository
  persistAppSettingRepository: PersistAppSettingRepository
}

const mockSut = (): SutTypes => {
  const findAppSettingRepository = makeFindAppSettingRepository()
  const persistAppSettingRepository = mockPersistAppSettingRepository()
  const sut = new PersistAppSettingUseCaseImpl(
    findAppSettingRepository,
    persistAppSettingRepository,
    new EventDispatcher()
  )
  return {
    sut,
    findAppSettingRepository,
    persistAppSettingRepository,
  }
}

const mockInput = (): PersistAppSettingUseCaseInput => ({
  appName: 'Monolithic',
  appDesc: 'The best boiller',
  imageUrl: null,
  appColorPrimary: '#448bff',
  appColorSecondary: '#448bff',
  appBackgroundPrimaryColor: '#448bff',
  appBackgroundSecondaryColor: '#448bff',
})

const mockEmptyInput = (): PersistAppSettingUseCaseInput => ({
  appName: '',
  appDesc: '',
  imageUrl: null,
  appColorPrimary: '',
  appColorSecondary: '',
  appBackgroundPrimaryColor: '',
  appBackgroundSecondaryColor: '',
})

test.group('Persit App Settings', () => {
  test('should be able to persist a new setting', async ({ expect }) => {
    const { sut } = mockSut()

    const output = await sut.perform(mockInput())
    expect(output.isRight()).toBeTruthy()
  })

  test('should throw when the inputs are empty', async ({ expect }) => {
    const { sut } = mockSut()
    const output = await sut.perform(mockEmptyInput())
    expect(output.isLeft()).toBeTruthy()
  })
})

import { ApplicationSettingsEntity } from './application_settings_entity.js'
import { Color } from '../value_objects/index.js'
import { test } from '@japa/runner'

test.group('first', () => {
  test('should create the application settings', ({ expect }) => {
    const color = Color.create({ value: '#448bff' })

    if (color.isLeft()) {
      throw new Error()
    }

    const sut = ApplicationSettingsEntity.create(
      'appName',
      'appDesc',
      null,
      color.value,
      color.value,
      color.value,
      color.value
    )

    expect(sut.isRight()).toBeTruthy()
  })

  test('should allow to change de appName', ({ expect }) => {
    const color = Color.create({ value: '#448bff' })

    if (color.isLeft()) {
      throw new Error()
    }
    const sut = ApplicationSettingsEntity.create(
      'appName',
      'appDesc',
      null,
      color.value,
      color.value,
      color.value,
      color.value
    )

    if (sut.isRight()) {
      const company = sut.value

      company.changeAppName('NewName')

      expect(company.appName).toBe('NewName')
    }
  })
})

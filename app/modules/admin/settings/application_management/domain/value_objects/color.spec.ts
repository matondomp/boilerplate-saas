import { test } from '@japa/runner'
import { Color } from './colors.js'

test.group('Color unit test', () => {
  test('should not create a color if it empty', ({ expect }) => {
    const sut = Color.create({ value: '' })

    expect(sut.isLeft()).toBeTruthy()
  })

  test('should not create a color is not a hexadecimal pattern', ({ expect }) => {
    const sut = Color.create({ value: '#448bff' })

    expect(sut.isRight()).toBeTruthy()
  })
})

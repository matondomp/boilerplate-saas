import { test } from '@japa/runner'
import { LogEntity } from './log_entity.js'
import { UserNameRequiredError } from '../errors/user_name_required_error.js'
import { TittleRequiredError } from '../errors/title_required_error.js'
import { SummaryRequiredError } from '../errors/summary_required_error.js'

test.group('Log entity test', () => {
  test('Should create a log', async ({ assert }) => {
    const log = LogEntity.create({
      title: 'valid_title',
      source: 'valid_source',
      username: 'valid_user',
      summary: 'valid_prop',
      fullLog: {},
      success: true,
      userId: 'valid_id',
    })

    assert.isTrue(log.isRight())
  })

  test('Should not create a log without a username', async ({ assert }) => {
    const log = LogEntity.create({
      title: 'valid_title',
      source: 'valid_source',
      username: '',
      fullLog: {},
      summary: '',
      success: true,
      userId: 'valid_id',
    })

    assert.isTrue(log.isLeft())
    assert.instanceOf(log.value, UserNameRequiredError)
  })

  test('Should not create a log without a title', async ({ assert }) => {
    const log = LogEntity.create({
      title: '',
      source: 'valid_source',
      username: 'valid_username',
      fullLog: {},
      summary: '',
      success: true,
      userId: 'valid_id',
    })

    assert.isTrue(log.isLeft())
    assert.instanceOf(log.value, TittleRequiredError)
  })

  test('Should not create a log with an empty summary', async ({ assert }) => {
    const log = LogEntity.create({
      title: 'valid_title',
      source: 'valid_source',
      username: 'valid_username',
      fullLog: {},
      summary: '',
      success: true,
      userId: 'valid_id',
    })

    assert.isTrue(log.isLeft())
    assert.instanceOf(log.value, SummaryRequiredError)
  })
})

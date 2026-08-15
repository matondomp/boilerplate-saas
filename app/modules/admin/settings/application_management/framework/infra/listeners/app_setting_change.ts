import { Handler } from '#app/listeners/handler'
import { AppSettingModifiedEvent } from '../../../domain/index.js'

// TODO: FILENAME NEED TO BE REFACTORED @ernesto.maria
export class LogAppSettingListener extends Handler {
  async handle(event: AppSettingModifiedEvent): Promise<void> {
    console.log('implement log', event)
  }
}

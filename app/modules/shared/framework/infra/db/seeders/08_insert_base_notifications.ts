import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { CoreNotificationModel } from '../models/core_notification_model.js'

export default class InsertBaseNotifications extends BaseSeeder {
  async run() {
    const notificationKeys = [
      'notifications.core.auth.login',
      'notifications.core.user.updated',
      'notifications.core.user.password_changed',
      'notifications.core.auth.sent_reset_password_link',
      'notifications.core.user.deactived',
      'notifications.core.user.reactivated',
    ]

    for (const notificationKey of notificationKeys) {
      await CoreNotificationModel.firstOrCreate({ notificationKey })
    }
  }
}

import { CoreUserModel } from '../models/index.js'
import { CoreNotificationModel } from '../models/core_notification_model.js'
import { CoreNotificationUserModel } from '../models/core_notification_user_model.js'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import env from '#start/env'

export default class InsertBaseNotifications extends BaseSeeder {
  async run() {
    const notificationModels = await CoreNotificationModel.all()
    const notifications = notificationModels.map((n) => n.id)

    const rootUser = await CoreUserModel.findBy(
      'email',
      env.get('ROOT_USER_EMAIL', 'root@mp.co.ao')
    )

    if (!rootUser) {
      throw new Error('"RootUser" doesn\'t exists!')
    }

    for (const notificationId of notifications) {
      await CoreNotificationUserModel.firstOrCreate({
        notificationId,
        userId: rootUser.id,
        type: 'platform',
      })
    }
  }
}

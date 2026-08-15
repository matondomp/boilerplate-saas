import { StatusEnum } from '#shared/domain/types/index'
import { CoreStatusModel } from '#shared/framework/infra/db/models/index'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class InsertBaseStatusesSeed extends BaseSeeder {
  async run() {
    const statuses = [
      {
        id: StatusEnum.ACTIVE,
        key: 'shared.status.active',
      },
      {
        id: StatusEnum.INACTIVE,
        key: 'shared.status.inactive',
      },
      {
        id: StatusEnum.PENDING,
        key: 'shared.status.pending',
      },
      {
        id: StatusEnum.DELETED,
        key: 'shared.status.deleted',
      },
    ]

    await CoreStatusModel.fetchOrCreateMany('id', statuses)
  }
}

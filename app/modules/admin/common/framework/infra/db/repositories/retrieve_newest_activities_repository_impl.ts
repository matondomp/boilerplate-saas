import { RetrieveLatestActivitiesRepository } from '#modules/admin/common/usecases/retrieve_newest_activities/index'
import { UniqueEntityID } from '#core/domain/index'
import { ActivityProps } from '#shared/framework/infra/inbox_processor/index'
import { CoreUserActivity } from '#shared/framework/infra/index'

export class RetrieveNewestActivitiesRepositoryImpl implements RetrieveLatestActivitiesRepository {
  private readonly collection = CoreUserActivity
  async find(userId: UniqueEntityID): Promise<ActivityProps[]> {
    const latestUserActivity = await this.collection
      .aggregate([
        {
          $match: {
            userId: userId.toString(),
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
        {
          $limit: 10,
        },
        {
          $group: {
            _id: '$sessionId',
          },
        },
      ])
      .toArray()

    if (!latestUserActivity.length) {
      return []
    }

    const sessionIds = latestUserActivity.map((uActivity: any) => String(uActivity._id))

    return this.collection
      .find({
        sessionId: {
          $in: sessionIds,
        },
      })
      .limit(10)
      .sort('createdAt', -1)
      .toArray()
  }
}

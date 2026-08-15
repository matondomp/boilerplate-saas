import { UniqueEntityID } from '#core/domain/index'
import { ActivityProps } from '#shared/framework/infra/inbox_processor/index'

export interface RetrieveLatestActivitiesRepository {
  find(userId: UniqueEntityID): Promise<ActivityProps[]>
}

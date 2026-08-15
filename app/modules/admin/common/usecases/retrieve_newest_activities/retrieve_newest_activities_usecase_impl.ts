import {
  RetrieveNewestActivitiesUseCase,
  RetrieveNewestActivitiesUseCaseInput,
  RetrieveNewestActivitiesUseCaseOutput,
} from '#modules/admin/common/domain/index'
import { RetrieveLatestActivitiesRepository } from './ports/index.js'
import { Either, left, right } from '#core/domain/index'
import { DateAdapter } from '#shared/domain/ports/index'
import { FindUsernameRepository } from '#shared/usecases/ports/find_username_repository'
import { UserNotFoundError } from '#shared/domain/errors/index'

export class RetrieveNewestActivitiesUseCaseImpl implements RetrieveNewestActivitiesUseCase {
  constructor(
    private readonly findUsernameRepository: FindUsernameRepository,
    private readonly retrieveLatestActivitiesRepository: RetrieveLatestActivitiesRepository,
    private readonly dateAdapter: DateAdapter
  ) {}
  async perform(
    input: RetrieveNewestActivitiesUseCaseInput
  ): Promise<Either<UserNotFoundError, RetrieveNewestActivitiesUseCaseOutput[]>> {
    const user = await this.findUsernameRepository.findUsername(input.userId)

    if (!user) {
      return left(new UserNotFoundError())
    }

    const output = await this.retrieveLatestActivitiesRepository.find(user.id).then((activities) =>
      activities.map((activity, index) => ({
        operation: activity.operation,
        success: activity.success,
        last: index === 0,
        payload: activity.payload,
        recordAt: this.dateAdapter.format(activity.createdAt),
        recordAtText: this.dateAdapter.toRelative(activity.createdAt),
      }))
    )

    return right(output)
  }
}

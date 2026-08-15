import { UseCase } from '#core/domain/index'
import {
  RetrieveNewestNotificationsUseCaseInput,
  RetrieveNewestNotificationsUseCaseOutput,
} from '#modules/admin/common/domain/index'
export type RetrieveNewestNotificationsUseCase = UseCase<
  RetrieveNewestNotificationsUseCaseInput,
  RetrieveNewestNotificationsUseCaseOutput
>

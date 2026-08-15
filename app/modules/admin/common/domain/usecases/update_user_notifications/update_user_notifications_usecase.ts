import { Either, UseCase } from '#core/domain/index'
import {
  InvalidNotificationTypeError,
  UpdateUserNotificationsUseCaseInput,
} from '#modules/admin/common/domain/index'

export type UpdateUserNotificationsUseCase = UseCase<
  UpdateUserNotificationsUseCaseInput,
  Either<InvalidNotificationTypeError, boolean>
>

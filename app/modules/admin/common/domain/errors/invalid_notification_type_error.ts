import { DomainError, Result } from '#core/domain/index'

export class InvalidNotificationTypeError extends Result<DomainError> {
  constructor() {
    super(false, {
      message: 'common.user.notification.invalid_notification_type',
      error: InvalidNotificationTypeError.name,
    })
  }
}

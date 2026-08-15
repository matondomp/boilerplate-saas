import { Handler } from '#app/listeners/handler'

import { UserInfoUpdatedEvent } from '#modules/admin/common/domain/index'

export class UserInfoUpdatedListener extends Handler {
  handle(event: UserInfoUpdatedEvent): void {
    console.log(event)
  }
}

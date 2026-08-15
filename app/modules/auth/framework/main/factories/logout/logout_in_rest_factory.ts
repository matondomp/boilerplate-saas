import { EventDispatcher } from '#core/domain/index'
import { LogoutApiController } from '../../controllers/logout/rest_logout_controller.js'
export const makeLogoutApiFactory = (): LogoutApiController =>
  new LogoutApiController(EventDispatcher.getInstance())

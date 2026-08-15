import { EventDispatcher } from '#core/domain/index'
import { LogoutWebController } from '../../controllers/logout/web_logout_controller.js'

export const makeLogoutWebController = (): LogoutWebController =>
  new LogoutWebController(EventDispatcher.getInstance())

import { StopImpersonateUserController } from '../controllers/stop_impersonate_user_controller.js'

export const makeStopImpersonateControllerFactory = (): StopImpersonateUserController => {
  return new StopImpersonateUserController()
}

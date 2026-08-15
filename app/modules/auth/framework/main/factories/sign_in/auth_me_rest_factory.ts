import { AuthMeApiController } from '../../controllers/rest_api_auth_me_controller.js'
export const makeAuthMeController = (): AuthMeApiController => new AuthMeApiController()

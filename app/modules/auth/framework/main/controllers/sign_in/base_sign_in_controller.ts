import { AuthenticateUserUseCase } from '#modules/auth/domain/usecases/index'
import { CoreUserModel } from '#modules/shared/framework/infra/index'
import { HttpContext } from '@adonisjs/core/http'
import { signInValidator } from '../../validators/sign_in_validator.js'
import limiter from '@adonisjs/limiter/services/main'

type SignInErrors = 'E_USER_MISMATCH' | 'E_TOO_MANY_REQUESTS'

type Result = {
  success: boolean
  userModel?: CoreUserModel
  rememberMe?: boolean
  message?: string
  error?: SignInErrors
}

export abstract class BaseSignInController {
  constructor(protected readonly authenticateUserUseCase: AuthenticateUserUseCase.Contract) {}
  async signIn({ request, i18n }: HttpContext): Promise<Result> {
    const validation = await signInValidator.validate(request.body(), {
      messagesProvider: signInValidator.messagesProvider,
    })

    const loginLimiter = limiter.use({
      requests: 3,
      duration: '5 min',
    })
    const key = `login_${request.ip()}_${validation.username}`
    const executed = await loginLimiter.attempt(key, async () => {
      const output = await this.authenticateUserUseCase.perform(validation)
      if (output.isLeft()) {
        return { success: false }
      }

      const userModel = await CoreUserModel.findOrFail(output.value.userId)
      return { success: true, userModel: userModel, rememberMe: validation.rememberMe }
    })
    if (!executed) {
      const message = i18n.formatMessage('auth.E_TOO_MANY_REQUESTS', {
        seconds: await loginLimiter.availableIn(key),
      })

      return { success: false, message, error: 'E_TOO_MANY_REQUESTS' }
    }
    if (!executed.success) {
      const message = i18n.formatMessage('auth.user.mismatch')
      return { success: false, message, error: 'E_USER_MISMATCH' }
    }

    await loginLimiter.delete(key)
    return executed
  }
}

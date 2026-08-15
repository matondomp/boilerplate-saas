import { SendResetPasswordUseCase } from '#modules/auth/domain/usecases/index'
import { sendResetPasswordLinkValidator } from '../validators/send_reset_password_link_validator.js'
import { Controller } from '#core/ports/index'
import { HttpContext } from '@adonisjs/core/http'
import limiter from '@adonisjs/limiter/services/main'

export class SendResetPasswordController implements Controller<HttpContext> {
  constructor(private readonly sendResetPasswordUseCase: SendResetPasswordUseCase.Contract) {}

  async perform({ request, response, session, i18n }: HttpContext) {
    const validation = await request.validateUsing(sendResetPasswordLinkValidator, {
      messagesProvider: sendResetPasswordLinkValidator.messagesProvider,
    })
    const sendResetPasswordLimiter = limiter.use({
      requests: 3,
      duration: '10 min',
    })

    const key = `send_reset_passsword_${request.ip()}_${validation.username}`

    const executed = await sendResetPasswordLimiter.attempt(key, async () => {
      const output = await this.sendResetPasswordUseCase.perform({ username: validation.username })

      if (output.isLeft()) {
        session.flash('alertGlobal', {
          success: false,
          message: i18n.formatMessage(output.value.errorMessage),
        })
        return { success: true }
      }

      session.flash('alertGlobal', {
        success: true,
        message: i18n.formatMessage('auth.reset_password.mail_sent'),
      })

      return { success: true }
    })

    if (!executed) {
      session.flashAll()
      session.flash('alertGlobal', {
        success: false,
        message: i18n.formatMessage('auth.send_reset_password.E_TOO_MANY_REQUESTS', {
          seconds: await sendResetPasswordLimiter.availableIn(key),
        }),
      })
    }

    return response.redirect().back()
  }
}

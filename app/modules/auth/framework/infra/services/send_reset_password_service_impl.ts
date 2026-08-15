import Encryption from '@adonisjs/core/services/encryption'
import { BroadcastMessageContract, EmailAdapter } from '#shared/domain/ports/index'
import {
  SendResetPasswordLinkInput,
  SendResetPasswordLinkService,
} from '#modules/auth/usecases/index'
import { CoreBroadcastEnum } from '#shared/domain/types/index'
import env from '#start/env'

export class SendResetPasswordServiceImpl implements SendResetPasswordLinkService {
  constructor(
    private readonly broadcastMessage: BroadcastMessageContract,
    private readonly emailAdapter: EmailAdapter
  ) {}

  async send(input: SendResetPasswordLinkInput): Promise<void> {
    const appName = env.get('APP_NAME')
    const resetPasswordLink = `${env.get('APP_INTERNAL_URL')}/security/auth/reset/password/${
      input.token
    }`

    const html = await this.emailAdapter.render(`${input.userLang}/send_reset_password_link`, {
      user: input,
      plataform: appName,
      link: resetPasswordLink,
      hash: Encryption.encrypt(env.get('APP_KEY')),
    })

    await this.broadcastMessage.publish('core.shared', {
      type: CoreBroadcastEnum.SEND_EMAIL,
      message: {
        content: html,
        subject: 'auth.request_password.request',
        to: input.username,
      },
      meta: {
        userId: null,
      },
    })
  }
}

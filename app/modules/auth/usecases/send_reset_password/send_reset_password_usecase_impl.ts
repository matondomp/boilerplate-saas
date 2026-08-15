import { IEventDispatcher, left, right } from '#core/domain/index'
import { UserNotFoundError } from '../../domain/errors/index.js'
import {
  FindUsernameRepository,
  HashAdapter,
  PersistResetPasswordTokenRepository,
  SendResetPasswordLinkService,
} from './ports/index.js'
import { TokenTypes } from '#modules/auth/domain/index'

import { SendResetPasswordUseCase } from '../../domain/usecases/send_reset_password_usecase.js'
import { SentResetPasswordEvent } from '../../domain/events/sent_reset_password_event.js'

export class SendResetPasswordUseCaseImpl implements SendResetPasswordUseCase.Contract {
  constructor(
    private readonly findUsernameRepository: FindUsernameRepository,
    private readonly hashAdapter: HashAdapter,
    private readonly persistResetPasswordTokenRepository: PersistResetPasswordTokenRepository,
    private readonly sendResetPasswordLinkService: SendResetPasswordLinkService,
    private readonly eventDispatcher: IEventDispatcher
  ) {}

  async perform(input: SendResetPasswordUseCase.Input): Promise<SendResetPasswordUseCase.Output> {
    const user = await this.findUsernameRepository.findUsername(input.username)

    if (!user) {
      return left(new UserNotFoundError())
    }
    const token = await this.hashAdapter.generate(user.id.toString(), TokenTypes.RECOVER_PASSWORD)
    await this.persistResetPasswordTokenRepository.persist(user.id, token)

    await this.sendResetPasswordLinkService.send({
      username: user.email,
      fullName: user.fullName,
      userLang: user.defaultLang,
      token,
    })

    this.eventDispatcher.publish(
      new SentResetPasswordEvent({
        userId: user.id,
      })
    )

    return right(true)
  }
}

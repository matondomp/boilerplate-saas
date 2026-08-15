import { resolve } from 'node:path'
import { SendResetPasswordUseCaseImpl } from '#modules/auth/usecases/index'
import { HashDriverAdapterImpl } from '#modules/auth/framework/infra/adapters/index'
import {
  FindUserToAuthenticateRepositoryImpl,
  PersistResetPasswordTokenRepositoryImpl,
} from '#modules/auth/framework/infra/db/repositories/index'

import { SendResetPasswordServiceImpl } from '../../infra/services/index.js'
import { SendResetPasswordController } from '../controllers/send_reset_password_controller.js'
import { EventDispatcher } from '#core/domain/index'
import { BroadcastMessageRepositoryImpl } from '#shared/framework/infra/index'
import { EmailAdapterImpl } from '#shared/framework/infra/adapters/email_adapter_impl'

export const makeSendResetPasswordController = (): SendResetPasswordController =>
  new SendResetPasswordController(
    new SendResetPasswordUseCaseImpl(
      new FindUserToAuthenticateRepositoryImpl(),
      new HashDriverAdapterImpl(),
      new PersistResetPasswordTokenRepositoryImpl(),
      new SendResetPasswordServiceImpl(
        new BroadcastMessageRepositoryImpl(),
        new EmailAdapterImpl(resolve(import.meta.dirname, '../..', 'infra/resources'))
      ),
      EventDispatcher.getInstance()
    )
  )

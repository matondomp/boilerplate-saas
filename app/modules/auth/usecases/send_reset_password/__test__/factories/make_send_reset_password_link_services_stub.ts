import {
  SendResetPasswordLinkInput,
  SendResetPasswordLinkService,
} from '#modules/auth/usecases/index'

export const makeSendResetPasswordLinkServiceStub = (): SendResetPasswordLinkService => {
  return new (class implements SendResetPasswordLinkService {
    async send(_input: SendResetPasswordLinkInput): Promise<void> {
      return Promise.resolve()
    }
  })()
}

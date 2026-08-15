import { VerifyPasswordMatchAdapter } from '#modules/auth/usecases/index'

export const makeVerifyPasswordMatchAdapterStub = (): VerifyPasswordMatchAdapter => {
  return new (class implements VerifyPasswordMatchAdapter {
    compare(_hash: string, _plain: string): Promise<boolean> {
      return Promise.resolve(true)
    }
  })()
}

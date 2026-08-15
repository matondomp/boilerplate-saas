import { HashAdapter } from '#modules/auth/usecases/index'

export const makeHashAdapterStub = (): HashAdapter => {
  return new (class implements HashAdapter {
    generate(_secret: string, _payload: string): Promise<string> {
      return Promise.resolve('valid_token')
    }
  })()
}

import { GenerateRandomPasswordService } from '#modules/admin/settings/acl/users_management/usecases/create_user/ports/index'

export const makeGenerateRandomPasswordServiceStub = (): GenerateRandomPasswordService => {
  return new (class implements GenerateRandomPasswordService {
    generate(_username: string): Promise<string> {
      return Promise.resolve('hash_password')
    }
  })()
}

import { GenerateRandomPasswordService } from '#modules/admin/settings/acl/users_management/usecases/create_user/ports/index'
import { cuid } from '@adonisjs/core/helpers'

export class GenerateRandomPasswordServiceImpl implements GenerateRandomPasswordService {
  async generate(_username: string): Promise<string> {
    return cuid()
  }
}

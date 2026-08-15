import { HttpContext } from '@adonisjs/core/http'
import { Controller } from '#core/ports/index'
import { DeleteBulkRolesUseCase } from '../../../domain/index.js'
import { DeleteBulkRolesValidator } from '../validations/delete_bulk_roles_validator.js'

export class DeleteBulkRolesController implements Controller<HttpContext> {
  constructor(private readonly useCase: DeleteBulkRolesUseCase) {}

  async perform({ i18n, auth, session, request, response }: HttpContext): Promise<any> {
    const validation = await request.validateUsing(DeleteBulkRolesValidator).catch(() => {})

    if (!validation) {
      session.flash('alert', {
        success: false,
        message: i18n.formatMessage('admin.acl.roles.delete.bulk.error.missing.role_list'),
      })

      return response.redirect().back()
    }

    await auth.user!.load('role')

    const output = await this.useCase.perform({
      roles: validation.roles,
      isRoot: auth.user!.role.isRoot,
    })

    if (output.isLeft()) {
      session.flash('alert', {
        success: false,
        message: i18n.formatMessage(output.value.errorMessage, output.value.errorValue().payload),
      })

      return response.redirect().back()
    }

    session.flash('alert', {
      success: true,
      message: i18n.formatMessage('admin.acl.roles.delete.bulk.success'),
    })

    return response.redirect().back()
  }
}

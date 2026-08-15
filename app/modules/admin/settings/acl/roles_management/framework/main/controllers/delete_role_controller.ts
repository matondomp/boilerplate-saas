import { Controller } from '#core/ports/index'
import { HttpContext } from '@adonisjs/core/http'
import { DeleteRoleUseCase } from '#modules/admin/settings/acl/roles_management/domain/index'
import { DeleteRoleValidation } from '#modules/admin/settings/acl/roles_management/framework/main/validations/delete_role_validation'

export class DeleteRoleController implements Controller<HttpContext> {
  constructor(private readonly deleteRoleUseCase: DeleteRoleUseCase) {}

  async perform({ auth, request, i18n, session, response }: HttpContext): Promise<any> {
    if (!auth.user) {
      return response.redirect().status(403).back()
    }

    const validation = await request.validateUsing(DeleteRoleValidation).catch(() => {})

    if (!validation) {
      session.flash('alert', {
        success: false,
        message: i18n.formatMessage('admin.acl.role.delete_role.role_id_missing'),
      })
      return response.redirect().back()
    }

    await auth.user.load('role')

    const output = await this.deleteRoleUseCase.perform({
      roleId: validation.roleId,
      isRoot: auth.user.role.isRoot ?? false,
    })

    if (output.isLeft()) {
      session.flash('alert', {
        success: false,
        message: i18n.formatMessage(output.value.errorMessage),
      })

      return response.redirect().withQs().back()
    }

    session.flash('alert', {
      success: true,
      message: i18n.formatMessage('admin.acl.role.role_deleted'),
    })

    return response.redirect().withQs().back()
  }
}

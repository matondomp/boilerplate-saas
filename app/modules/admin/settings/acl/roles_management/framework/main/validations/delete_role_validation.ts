// import { rules, schema } from '@ioc:Adonis/Core/Validator'
// import { HttpContext } from '@adonisjs/core/http'

import vine from '@vinejs/vine'

// export class DeleteRoleValidation {
//   constructor(protected readonly ctx: HttpContext) {}

const schema = vine.object({
  roleId: vine.string().trim(),
})

export const DeleteRoleValidation = vine.compile(schema)

//   message = {
//     'roleId.required': this.ctx.i18n.formatMessage('admin.acl.role.delete_role'),
//   }
// }

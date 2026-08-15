// import { HttpContext } from '@adonisjs/core/http'
// import { schema, rules } from '@ioc:Adonis/Core/Validator'

import vine from '@vinejs/vine'

const schema = vine.object({
  roleSlug: vine.string().trim(),
  name: vine.string().trim(),
  description: vine.string(),
  permissions: vine.array(vine.string()),
})

export const UpdateRoleValidation = vine.compile(schema)
//   messages = {
//     'roleSlug.required': this.ctx.i18n.formatMessage('admin.acl.roles.roleSlug.required'),
//     'name.required': this.ctx.i18n.formatMessage('admin.acl.roles.name.required'),
//     'description.required': this.ctx.i18n.formatMessage('admin.acl.roles.description.required'),
//     'description.*.required': this.ctx.i18n.formatMessage('admin.acl.roles.permissions.required'),
//   }
// }

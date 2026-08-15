// import { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
// import { schema, rules } from '@ioc:Adonis/Core/Validator'

// export class CreateRoleValidation {
//   constructor(protected readonly ctx: HttpContext) {}

const schema = vine.object({
  name: vine.string().trim(),
  description: vine.string(),
  permissions: vine.array(vine.string()),
  redirect: vine.boolean(),
})

export const CreateRoleValidation = vine.compile(schema)

//   messages = {
//     'name.required': this.ctx.i18n.formatMessage('admin.acl.roles.name.required'),
//     'description.required': this.ctx.i18n.formatMessage('admin.acl.roles.description.required'),
//     'description.*.required': this.ctx.i18n.formatMessage('admin.acl.roles.permissions.required'),
//   }
// }

// import { HttpContext } from '@adonisjs/core/http'
// import { schema, rules } from '@ioc:Adonis/Core/Validator'

import vine from '@vinejs/vine'

// export class PersistAppSettindValidator {
// constructor(protected readonly ctx: HttpContext) {}

const schema = vine.object({
  appName: vine.string().trim().minLength(2),
  appDesc: vine.string().trim().minLength(8),
  appColorPrimary: vine.string().trim(),
  appColorSecondary: vine.string().trim(),
  appBackgroundPrimaryColor: vine.string().trim(),
  appBackgroundSecondaryColor: vine.string().trim(),
})

export const PersistAppSettindValidator = vine.compile(schema)
//   readonly message = {
//     'appName.required': this.ctx.i18n.formatMessage('admin.acl.roles.name.required'),
//     'appDesc.required': this.ctx.i18n.formatMessage('admin.acl.roles.desc.required'),
//     'appColorPrimary.required': this.ctx.i18n.formatMessage(
//       'admin.acl.roles.appColorPrimary.required'
//     ),
//     'appColorSecondary.required': this.ctx.i18n.formatMessage(
//       'admin.acl.roles.appColorSecondary.required'
//     ),
//     'appBackgroundPrimaryColor.required': this.ctx.i18n.formatMessage(
//       'admin.acl.roles.appBackgroundPrimaryColor.required'
//     ),
//     'appBackgroundSecondaryColor.required': this.ctx.i18n.formatMessage(
//       'admin.acl.roles.appBackgroundSecondaryColor.required'
//     ),
//   }
// }

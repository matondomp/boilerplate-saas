// import { schema } from '@ioc:Adonis/Core/Validator'
// import type { HttpContext } from '@ioc:Adonis/Core/HttpContext'

import vine from '@vinejs/vine'

// export class CreateDashboardValidator {
//   constructor(protected ctx: HttpContext) {}

const schema = vine.object({
  name: vine.string(),
  description: vine.string(),
  redirect: vine.boolean().optional(),
})

export const CreateDashboardValidator = vine.compile(schema)

//   readonly messages = {
//     'name.required': this.ctx.i18n.formatMessage('dashboard_management.create.name.required'),
//     'name.unique': this.ctx.i18n.formatMessage('dashboard_management.create.name.unique'),
//     'description.required': this.ctx.i18n.formatMessage(
//       'dashboard_management.create.description.required'
//     ),
//   }
// }

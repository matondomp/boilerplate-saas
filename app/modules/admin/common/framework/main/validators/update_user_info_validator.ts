// import { rules, schema } from '@ioc:Adonis/Core/Validator'
// import { HttpContext } from '@adonisjs/core/http'

import string from '@adonisjs/core/helpers/string'
import vine from '@vinejs/vine'

// export class UpdateUserInfoValidator {
//   constructor(protected readonly ctx: HttpContext) {}

const schema = vine.object({
  firstName: vine
    .string()
    .trim()
    .transform((value) => {
      return string.capitalCase(value)
    }),
  lastName: vine
    .string()
    .trim()
    .transform((value) => {
      return string.capitalCase(value)
    }),
  defaultLang: vine.string().trim().optional(),
  timezone: vine.string().trim().optional(),
})
export const UpdateUserInfoValidator = vine.compile(schema)

//   readonly messages = {
//     'firstName.required': this.ctx.i18n.formatMessage('common.first_name.required'),
//     'lastName.required': this.ctx.i18n.formatMessage('common.last_name.required'),
//   }
// }

// import { rules, schema } from '@ioc:Adonis/Core/Validator'
// import { HttpContext } from '@adonisjs/core/http'

import vine from '@vinejs/vine'

// export class UpdatePasswordValidator {
//   constructor(protected readonly ctx: HttpContext) {}

const schema = vine.object({
  currentPassword: vine.string().trim().minLength(8),
  newPassword: vine.string().trim().minLength(8),
  confirmPassword: vine.string().trim().minLength(8),
})

export const UpdatePasswordValidator = vine.compile(schema)
//   readonly messages = {
//     required: 'common.settings.{{ field }}.missing.error',
//     minLength: 'common.settings.{{ field }}.min_length.error',
//   }
// }

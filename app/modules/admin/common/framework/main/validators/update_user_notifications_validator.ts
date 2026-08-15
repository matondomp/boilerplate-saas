// import { schema } from '@ioc:Adonis/Core/Validator'
// import { HttpContext } from '@adonisjs/core/http'

import vine from '@vinejs/vine'

// export class UpdateUserNotificationsValidator {
//   constructor(protected readonly ctx: HttpContext) {}
const schema = vine.object({
  platform: vine.array(vine.string().trim().optional()).optional(),
  email: vine.array(vine.string().trim().optional()).optional(),
})

export const UpdateUserNotificationsValidator = vine.compile(schema)
// }

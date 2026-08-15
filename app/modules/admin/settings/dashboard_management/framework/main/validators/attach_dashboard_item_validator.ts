// import { schema } from '@ioc:Adonis/Core/Validator'
// import { HttpContext } from '@adonisjs/core/http'

import vine from '@vinejs/vine'

// export class AttachDashboardItemValidator {
//   constructor(protected ctx: HttpContext) {}

const schema = vine.object({
  x: vine.number(),
  y: vine.number(),
  width: vine.number(),
  height: vine.number(),
})

export const AttachDashboardItemValidator = vine.compile(schema)
// }

// import { schema, rules } from '@ioc:Adonis/Core/Validator'
// import { HttpContext } from '@adonisjs/core/http'

import vine from '@vinejs/vine'

// export class UpdateDashboardItemsValidator {
//   constructor(protected ctx: HttpContext) {}

const schema = vine.object({
  items: vine.array(
    vine.object({
      dashboardSlug: vine.string(),
      itemId: vine.string(),
      x: vine.number(),
      y: vine.number(),
      width: vine.number(),
      height: vine.number(),
    })
  ),
})

export const UpdateDashboardItemsValidator = vine.compile(schema)
// }

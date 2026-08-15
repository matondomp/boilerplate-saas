// import { schema, rules } from '@ioc:Adonis/Core/Validator'
// import { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import { ChartsArrayValues } from '../../../domain/types/chart_types.js'

// export class UpdateDashboardItemValidator {
//   constructor(protected ctx: HttpContext) {}

const schema = vine.object({
  name: vine.string(),
  sqlRaw: vine.string(),
  chartType: vine.enum(ChartsArrayValues),
})

export const UpdateDashboardItemValidator = vine.compile(schema)
// }

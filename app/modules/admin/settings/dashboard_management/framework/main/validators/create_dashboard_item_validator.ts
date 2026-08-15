// import { schema, rules } from '@ioc:Adonis/Core/Validator'
// import { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import { ChartsArrayValues } from '../../../domain/types/chart_types.js'

// export class CreateDashboardItemValidator {
// constructor(protected ctx: HttpContext) {}

const schema = vine.object({
  name: vine.string(),
  dashboardId: vine.string(),
  sqlRaw: vine.string(),
  chartType: vine.enum(ChartsArrayValues),
  x: vine.number(),
  y: vine.number(),
  width: vine.number(),
  height: vine.number(),
})

export const CreateDashboardItemValidator = vine.compile(schema)
// }

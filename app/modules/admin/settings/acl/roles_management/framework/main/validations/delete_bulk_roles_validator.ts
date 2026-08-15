// import { schema, rules } from '@ioc:Adonis/Core/Validator'
// import { HttpContext } from '@adonisjs/core/http'
// export class DeleteBulkRolesValidator {
// constructor(protected readonly ctx: HttpContext) {}

import vine from '@vinejs/vine'

const schema = vine.object({
  roles: vine.array(vine.string()),
})

export const DeleteBulkRolesValidator = vine.compile(schema)
//   readonly messages = {}
// }

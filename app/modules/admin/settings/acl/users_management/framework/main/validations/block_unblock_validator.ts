// import { HttpContext } from '@adonisjs/core/http'
// import { schema, rules } from '@ioc:Adonis/Core/Validator'
// export class BlockUnblockValidator {
//   constructor(protected ctx: HttpContext) {}

import vine from '@vinejs/vine'

const schema = vine.object({
  username: vine.string().trim(),
  motivation: vine.string().trim().optional(),
})

export const BlockUnblockValidator = vine.compile(schema)
/**
 * Custom messages for validation failures. You can make use of dot notation `(.)`
 * for targeting nested fields and array expressions `(*)` for targeting all
 * children of an array. For example:
 *
 * {
 *   'profile.username.required': 'Username is required',
 *   'scores.*.number': 'Define scores as valid numbers'
 * }
 *
 */
//   messages = {}
// }

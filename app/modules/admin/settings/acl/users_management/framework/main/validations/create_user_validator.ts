// import { HttpContext } from '@adonisjs/core/http'
// export class CreateUserValidator {
//   constructor(protected ctx: HttpContext) {}

import vine from '@vinejs/vine'
import string from '@adonisjs/core/helpers/string'
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
  email: vine
    .string()
    .trim()
    .email()
    .transform((value) => {
      return value.toLowerCase()
    }),
  role: vine.string().trim(),
})

export const CreateUserValidator = vine.compile(schema)

import vine from '@vinejs/vine'

const schema = vine.object({
  user: vine.string().optional(),
  source: vine.string().optional(),
  success: vine.boolean().optional(),
})

export const ViewLogsFiltersValidator = vine.compile(schema)

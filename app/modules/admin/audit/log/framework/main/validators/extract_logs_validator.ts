import { ExtractLogsFilesFormatsEnum } from '#modules/admin/audit/log/domain/types/extract_logs_formats_enum'
import vine from '@vinejs/vine'

const schema = vine.object({
  fileFormat: vine.enum(ExtractLogsFilesFormatsEnum),
  title: vine.string().optional(),
  user: vine.string().optional(),
  source: vine.string().optional(),
  success: vine.boolean().optional(),
})

export const ExtractLogsValidator = vine.compile(schema)

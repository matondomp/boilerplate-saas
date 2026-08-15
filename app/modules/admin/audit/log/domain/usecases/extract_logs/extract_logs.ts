import { UseCase } from '#core/domain/use_case'
import { Search } from '#core/ports/search'
import { ExtractLogsFilesFormatsEnum } from '../../types/extract_logs_formats_enum.js'

export namespace ExtractLogsUseCase {
  export interface Input extends Search {
    title?: string
    user?: string
    source?: string
    date?: Date
    success?: boolean
    fileFormat: ExtractLogsFilesFormatsEnum
    localeTranslations: Record<string, string>
  }
  export type Contract = UseCase<Input, Buffer | string>
}

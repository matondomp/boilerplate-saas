import vine, { SimpleMessagesProvider } from '@vinejs/vine'
import { uniqueRule } from '#app/validators/unique_validator'

const schema = vine.object({
  name: vine.string().use(
    uniqueRule({
      table: 'core_dashboards',
      column: 'name',
    })
  ),
  description: vine.string(),
})

export const UpdateDashboardValidator = vine.compile(schema)

UpdateDashboardValidator.messagesProvider = new SimpleMessagesProvider({
  'name.required': 'dashboard_management.create.name.required',
  'name.unique': 'dashboard_management.create.name.unique',
  'description.required': 'dashboard_management.create.description.required',
})

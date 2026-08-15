import { CoreApplicationSettings } from '#shared/framework/infra/db/models/index'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class SetupApplicationSeeder extends BaseSeeder {
  async run() {
    await CoreApplicationSettings.create({
      appName: 'Monolith Boilerplate',
      appDesc: 'Unified modular application boilerplate',
      appBackgroundPrimaryColor: '#f9f9fa',
      appBackgroundSecondaryColor: '#f5f5f6',
      appColorPrimary: '#448bff',
      appColorSecondary: '#212529',
    })
  }
}

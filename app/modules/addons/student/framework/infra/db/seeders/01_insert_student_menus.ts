import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { CoreMenuModel } from '#shared/framework/infra/db/models/core_menu_model'

export default class InsertStudentMenusSeed extends BaseSeeder {
  async run() {
    await CoreMenuModel.firstOrCreate(
      { slug: 'student_management_menu' },
      {
        display: 'menu.student.students',
        url: '/admin/students',
        icon: 'users',
        permissionId: undefined,
        order: 8,
        belongsTo: 'academic_management_group',
      }
    )
  }
}

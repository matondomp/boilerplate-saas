import { CoreMenuModel } from '#shared/framework/infra/db/models/core_menu_model'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class InsertAcademicMenusSeed extends BaseSeeder {
  async run() {
    // Garantir remoção do grupo de avaliações obsoleto
    await CoreMenuModel.query().where('slug', 'evaluations_management_group').delete()

    // 1. Grupo Principal - Gestão Académica (Dropdown dentro do group_main)
    await CoreMenuModel.firstOrCreate(
      { slug: 'academic_management_group' },
      {
        display: 'menu.academic.group',
        url: '',
        icon: 'book',
        isGroup: false,
        order: 3,
        belongsTo: 'group_main',
      }
    )

    // Submenus de Gestão Académica
    await CoreMenuModel.firstOrCreate(
      { slug: 'academic_universities_menu' },
      {
        display: 'menu.academic.universities',
        url: '/academic/universities',
        icon: 'home',
        permissionId: 'academic-universities-view',
        order: 1,
        belongsTo: 'academic_management_group',
      }
    )

    await CoreMenuModel.firstOrCreate(
      { slug: 'academic_courses_menu' },
      {
        display: 'menu.academic.courses',
        url: '/academic/courses',
        icon: 'layers',
        permissionId: 'academic-courses-view',
        order: 2,
        belongsTo: 'academic_management_group',
      }
    )

    await CoreMenuModel.firstOrCreate(
      { slug: 'academic_subjects_menu' },
      {
        display: 'menu.academic.subjects',
        url: '/academic/subjects',
        icon: 'bookmark',
        permissionId: 'academic-subjects-view',
        order: 3,
        belongsTo: 'academic_management_group',
      }
    )

    await CoreMenuModel.firstOrCreate(
      { slug: 'academic_topics_menu' },
      {
        display: 'menu.academic.topics',
        url: '/academic/topics',
        icon: 'git-merge',
        permissionId: 'academic-topics-view',
        order: 4,
        belongsTo: 'academic_management_group',
      }
    )

    // Submenus de Avaliações (agora pertencentes a academic_management_group)
    await CoreMenuModel.firstOrCreate(
      { slug: 'academic_exams_menu' },
      {
        display: 'menu.academic.exams',
        url: '/academic/exams',
        icon: 'award',
        permissionId: 'academic-exams-view',
        order: 5,
        belongsTo: 'academic_management_group',
      }
    )

    await CoreMenuModel.firstOrCreate(
      { slug: 'academic_questions_menu' },
      {
        display: 'menu.academic.questions',
        url: '/academic/questions',
        icon: 'help-circle',
        permissionId: 'academic-questions-view',
        order: 6,
        belongsTo: 'academic_management_group',
      }
    )

    await CoreMenuModel.firstOrCreate(
      { slug: 'academic_reviews_menu' },
      {
        display: 'menu.academic.reviews',
        url: '/academic/questions/review',
        icon: 'check-circle',
        permissionId: 'academic-questions-review',
        order: 7,
        belongsTo: 'academic_management_group',
      }
    )
  }
}

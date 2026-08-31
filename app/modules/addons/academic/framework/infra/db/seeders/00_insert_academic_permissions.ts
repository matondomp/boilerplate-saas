import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { CorePermissionModel } from '#shared/framework/infra/db/models/index'

export default class InsertAcademicPermissionsSeed extends BaseSeeder {
  async run() {
    const permissions = [
      {
        id: 'academic-universities-view',
        group: 'permission.group.academic',
        display: 'permission.academic.universities.view',
        description: 'permission.academic.universities.view.description',
      },
      {
        id: 'academic-universities-manage',
        group: 'permission.group.academic',
        display: 'permission.academic.universities.manage',
        description: 'permission.academic.universities.manage.description',
      },
      {
        id: 'academic-courses-view',
        group: 'permission.group.academic',
        display: 'permission.academic.courses.view',
        description: 'permission.academic.courses.view.description',
      },
      {
        id: 'academic-courses-manage',
        group: 'permission.group.academic',
        display: 'permission.academic.courses.manage',
        description: 'permission.academic.courses.manage.description',
      },
      {
        id: 'academic-subjects-view',
        group: 'permission.group.academic',
        display: 'permission.academic.subjects.view',
        description: 'permission.academic.subjects.view.description',
      },
      {
        id: 'academic-subjects-manage',
        group: 'permission.group.academic',
        display: 'permission.academic.subjects.manage',
        description: 'permission.academic.subjects.manage.description',
      },
      {
        id: 'academic-topics-view',
        group: 'permission.group.academic',
        display: 'permission.academic.topics.view',
        description: 'permission.academic.topics.view.description',
      },
      {
        id: 'academic-topics-manage',
        group: 'permission.group.academic',
        display: 'permission.academic.topics.manage',
        description: 'permission.academic.topics.manage.description',
      },
      {
        id: 'academic-exams-view',
        group: 'permission.group.academic',
        display: 'permission.academic.exams.view',
        description: 'permission.academic.exams.view.description',
      },
      {
        id: 'academic-exams-manage',
        group: 'permission.group.academic',
        display: 'permission.academic.exams.manage',
        description: 'permission.academic.exams.manage.description',
      },
      {
        id: 'academic-questions-view',
        group: 'permission.group.academic',
        display: 'permission.academic.questions.view',
        description: 'permission.academic.questions.view.description',
      },
      {
        id: 'academic-questions-manage',
        group: 'permission.group.academic',
        display: 'permission.academic.questions.manage',
        description: 'permission.academic.questions.manage.description',
      },
      {
        id: 'academic-questions-review',
        group: 'permission.group.academic',
        display: 'permission.academic.questions.review',
        description: 'permission.academic.questions.review.description',
      },
    ]

    for (const p of permissions) {
      await CorePermissionModel.firstOrCreate(
        { id: p.id },
        {
          group: p.group,
          display: p.display,
          description: p.description,
        }
      )
    }
  }
}

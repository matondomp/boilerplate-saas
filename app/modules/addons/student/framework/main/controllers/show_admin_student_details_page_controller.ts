import { Controller } from '#core/ports/index'
import { HttpContext } from '@adonisjs/core/http'
import { StudentRepositoriesImpl } from '../../infra/db/repositories/index.js'

export class ShowAdminStudentDetailsPageController implements Controller<HttpContext> {
  async perform(ctx: HttpContext): Promise<any> {
    const { params, inertia, response } = ctx
    const repo = new StudentRepositoriesImpl()
    const student = await repo.findById(params.id)

    if (!student) {
      return response.redirect().toPath('/admin/students')
    }

    return inertia.render<any>('admin/admin_student_details_page', {
      student: {
        id: student.id.toString(),
        userId: student.userId.toString(),
        status: String(student.status),
        profile: student.profile ? {
          fullName: student.profile.fullName,
          phone: student.profile.phone,
          preferredLanguage: student.profile.preferredLanguage,
          birthYear: student.profile.birthYear,
          avatarUrl: (student.profile as any).avatarUrl || null,
        } : null,
        goals: [],
        createdAt: student.createdAt,
      },
    })
  }
}

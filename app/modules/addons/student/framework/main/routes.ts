import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { routeAdapter } from '#app/adapters/route_adapter'
import {
  makeSendResetPasswordController,
  makeResetPasswordFactory,
  makeSignApiInController,
} from '#modules/auth/framework/main/factories/index'

import {
  makeStudentSwaggerControllerFactory,
  makeCreatePreparationGoalControllerFactory,
  makeListStudentGoalsControllerFactory,
  makeSetPrimaryPreparationGoalControllerFactory,
  makeGetStudentProfileControllerFactory,
  makePausePreparationGoalControllerFactory,
  makeResumePreparationGoalControllerFactory,
  makeUpdateStudentProfileControllerFactory,
  makeListAdminStudentsControllerFactory,
  makeUpdateStudentStatusControllerFactory,
  makeShowAdminStudentsPageControllerFactory,
  makeShowAdminStudentDetailsPageControllerFactory,
  makeStudentSignupControllerFactory,
} from './factories/index.js'

// Public Student Routes (No Auth Required)
router
  .group(() => {
    router
      .get('/docs', routeAdapter(makeStudentSwaggerControllerFactory(), {
        operation: 'student-swagger-ui',
        description: '[Student] Standalone Swagger UI Documentation',
      }))
      .as('student.docs.ui')

    router
      .get('/docs/json', routeAdapter(makeStudentSwaggerControllerFactory(), {
        operation: 'student-swagger-json',
        description: '[Student] Standalone OpenAPI 3.0 Spec JSON',
      }))
      .as('student.docs.json')

    router
      .post('/auth/signup', routeAdapter(makeStudentSignupControllerFactory(), {
        operation: 'student-signup',
        description: '[Student] Mobile Signup registration for new students',
      }))
      .as('student.auth.signup')

    router
      .post('/auth/signin', routeAdapter(makeSignApiInController(), {
        operation: 'student-signin',
        description: '[Student] Mobile Signin / Login for registered students',
      }))
      .as('student.auth.signin')

    router
      .post('/auth/forgot-password', routeAdapter(makeSendResetPasswordController(), {
        operation: 'student-forgot-password',
        description: '[Student] Request password recovery email and token for mobile student',
      }))
      .as('student.auth.forgot_password')

    router
      .post('/auth/reset-password', routeAdapter(makeResetPasswordFactory(), {
        operation: 'student-reset-password',
        description: '[Student] Reset student password using recovery token',
      }))
      .as('student.auth.reset_password')
  })
  .prefix('/api/v1/student')

// Authenticated Student API Routes
router
  .group(() => {
    router
      .post('/goals', routeAdapter(makeCreatePreparationGoalControllerFactory(), {
        operation: 'student-create-goal',
        description: '[Student] Create a new preparation goal',
      }))
      .as('student.goals.create')

    router
      .get('/goals', routeAdapter(makeListStudentGoalsControllerFactory(), {
        operation: 'student-list-goals',
        description: '[Student] List all goals of the authenticated student',
      }))
      .as('student.goals.list')

    router
      .patch('/goals/primary', routeAdapter(makeSetPrimaryPreparationGoalControllerFactory(), {
        operation: 'student-set-primary-goal',
        description: '[Student] Set primary preparation goal',
      }))
      .as('student.goals.set_primary')

    router
      .post('/goals/:id/pause', routeAdapter(makePausePreparationGoalControllerFactory(), {
        operation: 'student-pause-goal',
        description: '[Student] Pause preparation goal',
      }))
      .as('student.goals.pause')

    router
      .post('/goals/:id/resume', routeAdapter(makeResumePreparationGoalControllerFactory(), {
        operation: 'student-resume-goal',
        description: '[Student] Resume preparation goal',
      }))
      .as('student.goals.resume')

    router
      .get('/profile', routeAdapter(makeGetStudentProfileControllerFactory(), {
        operation: 'student-get-profile',
        description: '[Student] Get authenticated student profile',
      }))
      .as('student.profile.get')

    router
      .put('/profile', routeAdapter(makeUpdateStudentProfileControllerFactory(), {
        operation: 'student-update-profile',
        description: '[Student] Update authenticated student profile',
      }))
      .as('student.profile.update')
  })
  .prefix('/api/v1/student')
  .middleware([middleware.auth({ guards: ['api', 'web'] })])

// Admin API Routes
router
  .group(() => {
    router
      .get('/students', routeAdapter(makeListAdminStudentsControllerFactory(), {
        operation: 'admin-list-students',
        description: '[Admin] Paginated list of students with search & filters',
      }))
      .as('admin.students.list')

    router
      .patch('/students/:id/status', routeAdapter(makeUpdateStudentStatusControllerFactory(), {
        operation: 'admin-update-student-status',
        description: '[Admin] Update student status (ACTIVE, INACTIVE, SUSPENDED)',
      }))
      .as('admin.students.update_status')
  })
  .prefix('/api/v1/admin')
  .middleware([middleware.auth()])

// Admin Web Page Routes
router
  .group(() => {
    router
      .get('/students', routeAdapter(makeShowAdminStudentsPageControllerFactory(), {
        operation: 'admin-show-students-page',
        description: '[Admin] Render students list page inside AccountLayout',
      }))
      .as('admin.students.page')

    router
      .get('/students/:id', routeAdapter(makeShowAdminStudentDetailsPageControllerFactory(), {
        operation: 'admin-show-student-details-page',
        description: '[Admin] Render student details page inside AccountLayout',
      }))
      .as('admin.students.details_page')

    router
      .patch('/students/:id/status', routeAdapter(makeUpdateStudentStatusControllerFactory(), {
        operation: 'admin-update-student-status-web',
        description: '[Admin] Update student status from Web Admin UI',
      }))
      .as('admin.students.update_status_web')
  })
  .prefix('/admin')
  .middleware([middleware.auth()])

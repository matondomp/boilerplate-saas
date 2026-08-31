import { routeAdapter } from '#app/adapters/route_adapter'
import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import {
  makeChangeCourseStatusControllerFactory,
  makeChangeQuestionStatusControllerFactory,
  makeChangeUniversityStatusControllerFactory,
  makeCreateCourseControllerFactory,
  makeCreateExamControllerFactory, makeUpdateExamControllerFactory,
  makeCreatePreparationGoalControllerFactory,
  makeCreateQuestionControllerFactory,
  makeCreateSubjectControllerFactory,
  makeCreateTopicControllerFactory,
  makeCreateUniversityControllerFactory,
  makeShowCoursesPageControllerFactory,
  makeShowExamsPageControllerFactory,
  makeShowQuestionEditorPageControllerFactory,
  makeShowQuestionReviewPageControllerFactory,
  makeShowQuestionsPageControllerFactory,
  makeShowSubjectsPageControllerFactory,
  makeShowTopicsPageControllerFactory,
  makeShowUniversitiesPageControllerFactory,
  makeUpdateCourseControllerFactory,
  makeUpdateQuestionControllerFactory,
  makeUpdateSubjectControllerFactory,
  makeUpdateTopicControllerFactory,
  makeUpdateUniversityControllerFactory,
  makeUploadExamPdfControllerFactory,
} from './factories/index.js'

// ==========================================
// Rotas Web (Inertia.js Pages)
// ==========================================
router
  .group(() => {
    router
      .get(
        '/universities',
        routeAdapter(makeShowUniversitiesPageControllerFactory(), {
          operation: 'academic-view-universities-page',
          description: '[Academic UI] View universities page',
        })
      )
      .as('academic.universities.index')
      .middleware(middleware.can('academic-universities-view'))

    router
      .get(
        '/courses',
        routeAdapter(makeShowCoursesPageControllerFactory(), {
          operation: 'academic-view-courses-page',
          description: '[Academic UI] View courses page',
        })
      )
      .as('academic.courses.index')
      .middleware(middleware.can('academic-courses-view'))

    router
      .get(
        '/subjects',
        routeAdapter(makeShowSubjectsPageControllerFactory(), {
          operation: 'academic-view-subjects-page',
          description: '[Academic UI] View subjects page',
        })
      )
      .as('academic.subjects.index')
      .middleware(middleware.can('academic-subjects-view'))

    router
      .get(
        '/topics',
        routeAdapter(makeShowTopicsPageControllerFactory(), {
          operation: 'academic-view-topics-page',
          description: '[Academic UI] View topics hierarchy tree page',
        })
      )
      .as('academic.topics.index')
      .middleware(middleware.can('academic-topics-view'))

    router
      .get(
        '/exams',
        routeAdapter(makeShowExamsPageControllerFactory(), {
          operation: 'academic-view-exams-page',
          description: '[Academic UI] View exams page',
        })
      )
      .as('academic.exams.index')
      .middleware(middleware.can('academic-exams-view'))

    router
      .get(
        '/questions',
        routeAdapter(makeShowQuestionsPageControllerFactory(), {
          operation: 'academic-view-questions-page',
          description: '[Academic UI] View questions bank page',
        })
      )
      .as('academic.questions.index')
      .middleware(middleware.can('academic-questions-view'))

    router
      .get(
        '/questions/review',
        routeAdapter(makeShowQuestionsPageControllerFactory(), {
          operation: 'academic-view-questions-review-list-page',
          description: '[Academic UI] View questions bank review list page',
        })
      )
      .as('academic.questions.review_list')
      .middleware(middleware.can('academic-questions-review'))

    router
      .get(
        '/questions/new',
        routeAdapter(makeShowQuestionEditorPageControllerFactory(), {
          operation: 'academic-view-create-question-page',
          description: '[Academic UI] View create question editor page',
        })
      )
      .as('academic.questions.new')
      .middleware(middleware.can('academic-questions-manage'))

    router
      .get(
        '/questions/:id/edit',
        routeAdapter(makeShowQuestionEditorPageControllerFactory(), {
          operation: 'academic-view-edit-question-page',
          description: '[Academic UI] View edit question editor page',
        })
      )
      .as('academic.questions.edit')
      .middleware(middleware.can('academic-questions-manage'))

    router
      .get(
        '/questions/:id/review',
        routeAdapter(makeShowQuestionReviewPageControllerFactory(), {
          operation: 'academic-view-question-review-page',
          description: '[Academic UI] View question review and moderation page',
        })
      )
      .as('academic.questions.review')
      .middleware(middleware.can('academic-questions-review'))
  })
  .prefix('/academic')
  .middleware([middleware.auth()])

// ==========================================
// Rotas de API REST
// ==========================================
router
  .group(() => {
    // Gestão de Universidades
    router
      .post(
        '/universities',
        routeAdapter(makeCreateUniversityControllerFactory(), {
          operation: 'academic-create-university',
          description: '[Academic] Create a new university',
        })
      )
      .as('universities.create')
      .middleware(middleware.can('academic-universities-manage'))

    router
      .put(
        '/universities/:id',
        routeAdapter(makeUpdateUniversityControllerFactory(), {
          operation: 'academic-update-university',
          description: '[Academic] Update university details',
        })
      )
      .as('universities.update')
      .middleware(middleware.can('academic-universities-manage'))

    router
      .patch(
        '/universities/:id/status',
        routeAdapter(makeChangeUniversityStatusControllerFactory(), {
          operation: 'academic-change-university-status',
          description: '[Academic] Change university active status',
        })
      )
      .as('universities.status')
      .middleware(middleware.can('academic-universities-manage'))

    // Gestão de Cursos
    router
      .post(
        '/courses',
        routeAdapter(makeCreateCourseControllerFactory(), {
          operation: 'academic-create-course',
          description: '[Academic] Create a new course',
        })
      )
      .as('courses.create')
      .middleware(middleware.can('academic-courses-manage'))

    router
      .put(
        '/courses/:id',
        routeAdapter(makeUpdateCourseControllerFactory(), {
          operation: 'academic-update-course',
          description: '[Academic] Update course details',
        })
      )
      .as('courses.update')
      .middleware(middleware.can('academic-courses-manage'))

    router
      .patch(
        '/courses/:id/status',
        routeAdapter(makeChangeCourseStatusControllerFactory(), {
          operation: 'academic-change-course-status',
          description: '[Academic] Change course active status',
        })
      )
      .as('courses.status')
      .middleware(middleware.can('academic-courses-manage'))

    // Gestão de Disciplinas
    router
      .post(
        '/subjects',
        routeAdapter(makeCreateSubjectControllerFactory(), {
          operation: 'academic-create-subject',
          description: '[Academic] Create a new subject',
        })
      )
      .as('subjects.create')
      .middleware(middleware.can('academic-subjects-manage'))

    router
      .put(
        '/subjects/:id',
        routeAdapter(makeUpdateSubjectControllerFactory(), {
          operation: 'academic-update-subject',
          description: '[Academic] Update subject details',
        })
      )
      .as('subjects.update')
      .middleware(middleware.can('academic-subjects-manage'))

    // Gestão de Tópicos
    router
      .post(
        '/topics',
        routeAdapter(makeCreateTopicControllerFactory(), {
          operation: 'academic-create-topic',
          description: '[Academic] Create a new topic in subject tree',
        })
      )
      .as('topics.create')
      .middleware(middleware.can('academic-topics-manage'))

    router
      .put(
        '/topics/:id',
        routeAdapter(makeUpdateTopicControllerFactory(), {
          operation: 'academic-update-topic',
          description: '[Academic] Update topic in tree',
        })
      )
      .as('topics.update')
      .middleware(middleware.can('academic-topics-manage'))

    // Gestão de Exames
    router
      .post(
        '/exams',
        routeAdapter(makeCreateExamControllerFactory(), {
          operation: 'academic-create-exam',
          description: '[Academic] Create a new exam for course',
        })
      )
      .as('exams.create')
      .middleware(middleware.can('academic-exams-manage'))

    router
      .put(
        '/exams/:id',
        routeAdapter(makeUpdateExamControllerFactory(), {
          operation: 'academic-update-exam',
          description: '[Academic] Update exam details',
        })
      )
      .as('exams.update')
      .middleware(middleware.can('academic-exams-manage'))

    router
      .post(
        '/exams/:id/upload-pdf',
        routeAdapter(makeUploadExamPdfControllerFactory(), {
          operation: 'academic-upload-exam-pdf',
          description: '[Academic] Upload PDF document for exam ingestion',
        })
      )
      .as('exams.upload_pdf')
      .middleware(middleware.can('academic-exams-manage'))

    // Gestão de Questões (CRUD e Moderação)
    router
      .post(
        '/questions',
        routeAdapter(makeCreateQuestionControllerFactory(), {
          operation: 'academic-create-question',
          description: '[Academic] Create a new question with options',
        })
      )
      .as('questions.create')
      .middleware(middleware.can('academic-questions-manage'))

    router
      .put(
        '/questions/:id',
        routeAdapter(makeUpdateQuestionControllerFactory(), {
          operation: 'academic-update-question',
          description: '[Academic] Update question with revision tracking and optimistic lock',
        })
      )
      .as('questions.update')
      .middleware(middleware.can('academic-questions-manage'))

    router
      .patch(
        '/questions/:id/status',
        routeAdapter(makeChangeQuestionStatusControllerFactory(), {
          operation: 'academic-change-question-status',
          description: '[Academic] Change question status along moderation pipeline',
        })
      )
      .as('questions.change_status')
      .middleware(middleware.can('academic-questions-review'))
  })
  .prefix('/api/v1/academic')
  .middleware([middleware.auth()])

// Rotas do Estudante (Preparação e Metas)
router
  .group(() => {
    router
      .post(
        '/goals',
        routeAdapter(makeCreatePreparationGoalControllerFactory(), {
          operation: 'student-create-preparation-goal',
          description: '[Student] Create a new preparation goal for target course/university',
        })
      )
      .as('goals.create')
  })
  .prefix('/api/v1/student')
  .middleware([middleware.auth()])

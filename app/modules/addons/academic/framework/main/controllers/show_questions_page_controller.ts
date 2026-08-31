import { Controller } from '#core/ports/index'
import { HttpContext } from '@adonisjs/core/http'
import {
  AcademicQuestionModel,
  AcademicSubjectModel,
} from '../../infra/db/models/index.js'
import fs from 'node:fs'

export class ShowQuestionsPageController implements Controller<HttpContext> {
  async perform({ request, inertia }: HttpContext): Promise<any> {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)
    const statementFilter = request.input('statement', '')
    
    // Default status to PENDING_MODERATION if accessed via the moderation route
    const isReviewList = request.url().includes('/questions/review')
    const statusFilter = request.input('status', isReviewList ? 'PENDING_MODERATION' : '')
    
    const subjectIdFilter = request.input('subjectId', '')
    const difficultyFilter = request.input('difficulty', '')

    const query = AcademicQuestionModel.query()
      .whereNull('deleted_at')
      .preload('subject')
      .preload('topic')
      .preload('options')

    if (statementFilter) {
      query.whereILike('statement', `%${statementFilter}%`)
    }

    if (statusFilter) {
      if (statusFilter === 'PENDING_MODERATION') {
        query.whereIn('status', ['DRAFT', 'UNDER_REVIEW', 'AI_PROCESSED', 'APPROVED'])
      } else {
        query.where('status', statusFilter)
      }
    }

    if (subjectIdFilter) {
      query.where('subject_id', subjectIdFilter)
    }

    if (difficultyFilter) {
      query.where('difficulty', difficultyFilter)
    }

    const questions = await query.orderBy('created_at', 'desc').paginate(page, perPage)
    const subjects = await AcademicSubjectModel.query().whereNull('deleted_at').orderBy('name', 'asc')

    // DIAGNOSTIC LOGGING
    try {
      const logMessage = `[DIAGNOSTIC] ${new Date().toISOString()} | URL: ${request.url()} | isReviewList: ${isReviewList} | statusFilter: ${statusFilter} | returned questions count: ${questions.all().length}\n`
      fs.appendFileSync('/home/mp/projectos/boilerPlate/tmp_log.txt', logMessage)
    } catch (e) {
      // ignore log errors
    }

    return inertia.render<any>('questions/questions_page', {
      content: {
        data: questions.all().map((q) => ({
          id: q.id,
          statement: q.statement,
          subjectName: q.subject?.name,
          topicName: q.topic?.name,
          difficulty: q.difficulty,
          type: q.type,
          status: q.status,
          version: q.version,
          sourceMetadata: q.sourceMetadata,
          createdAt: q.createdAt?.toFormat('dd/MM/yyyy HH:mm'),
        })),
        pagination: questions.getMeta(),
      },
      subjects: subjects.map((s) => ({ id: s.id, name: s.name })),
    })
  }
}

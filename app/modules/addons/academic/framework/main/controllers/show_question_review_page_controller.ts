import { Controller } from '#core/ports/index'
import { HttpContext } from '@adonisjs/core/http'
import {
  AcademicQuestionModel,
  AcademicQuestionRevisionModel,
  AcademicQuestionRelationModel,
} from '../../infra/db/models/index.js'

export class ShowQuestionReviewPageController implements Controller<HttpContext> {
  async perform({ params, inertia, response }: HttpContext): Promise<any> {
    const questionId = params.id

    const question = await AcademicQuestionModel.query()
      .where('id', questionId)
      .preload('subject')
      .preload('topic')
      .preload('options')
      .first()

    if (!question) {
      return response.notFound({ message: 'Questão não encontrada' })
    }

    const revisions = await AcademicQuestionRevisionModel.query()
      .where('question_id', questionId)
      .preload('author')
      .orderBy('revision_number', 'desc')

    const relations = await AcademicQuestionRelationModel.query()
      .where('source_question_id', questionId)
      .preload('targetQuestion')

    return inertia.render<any>('question_review/question_review_page', {
      question: {
        id: question.id,
        statement: question.statement,
        subjectName: question.subject?.name,
        topicName: question.topic?.name,
        difficulty: question.difficulty,
        type: question.type,
        status: question.status,
        version: question.version,
        solution: question.solution,
        explanation: question.explanation,
        sourceMetadata: question.sourceMetadata,
        options: question.options ? question.options.map((o) => ({
          id: o.id,
          label: o.label,
          content: o.content,
          isCorrect: o.isCorrect,
          position: o.position,
        })) : [],
        relations: relations.map((r) => ({
          relationType: r.relationType,
          targetQuestionStatement: r.targetQuestion?.statement || '',
        })),
      },
      revisions: revisions.map((rev) => ({
        revisionNumber: rev.revisionNumber,
        authorName: rev.author ? `${rev.author.firstName} ${rev.author.lastName}` : 'Sistema',
        reason: rev.reason,
        createdAt: rev.createdAt?.toFormat('dd/MM/yyyy HH:mm'),
      })),
    })
  }
}

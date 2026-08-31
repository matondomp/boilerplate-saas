import { Controller } from '#core/ports/index'
import { HttpContext } from '@adonisjs/core/http'
import {
  AcademicQuestionModel,
  AcademicSubjectModel,
  AcademicTopicModel,
  AcademicExamModel,
} from '../../infra/db/models/index.js'

export class ShowQuestionEditorPageController implements Controller<HttpContext> {
  async perform({ params, inertia }: HttpContext): Promise<any> {
    const questionId = params.id
    let questionData = null

    if (questionId && questionId !== 'new') {
      const q = await AcademicQuestionModel.query()
        .where('id', questionId)
        .preload('options')
        .first()

      if (q) {
        questionData = {
          id: q.id,
          version: q.version,
          statement: q.statement,
          subjectId: q.subjectId,
          topicId: q.topicId,
          difficulty: q.difficulty,
          type: q.type,
          source: q.source,
          examId: q.examId,
          solution: q.solution,
          explanation: q.explanation,
          options: q.options ? q.options.map((o) => ({
            id: o.id,
            label: o.label,
            content: o.content,
            position: o.position,
            isCorrect: o.isCorrect,
          })) : [],
        }
      }
    }

    const subjects = await AcademicSubjectModel.query().whereNull('deleted_at').orderBy('name', 'asc')
    const topics = await AcademicTopicModel.query().orderBy('name', 'asc')
    const exams = await AcademicExamModel.query()
      .whereNull('deleted_at')
      .preload('course')
      .orderBy('year', 'desc')

    return inertia.render<any>('question_editor/question_editor_page', {
      question: questionData,
      subjects: subjects.map((s) => ({ id: s.id, name: s.name })),
      topics: topics.map((t) => ({ id: t.id, name: t.name, subjectId: t.subjectId })),
      exams: exams.map((e) => ({
        id: e.id,
        year: e.year,
        period: e.period,
        courseName: e.course?.name,
      })),
    })
  }
}

import { Controller } from '#core/ports/index'
import { HttpContext } from '@adonisjs/core/http'
import {
  AcademicTopicModel,
  AcademicSubjectModel,
} from '../../infra/db/models/index.js'

export class ShowTopicsPageController implements Controller<HttpContext> {
  async perform({ request, inertia }: HttpContext): Promise<any> {
    const subjectIdFilter = request.input('subjectId', '')

    const subjects = await AcademicSubjectModel.query().whereNull('deleted_at').orderBy('name', 'asc')

    const topicsQuery = AcademicTopicModel.query().orderBy('level', 'asc').orderBy('name', 'asc')
    if (subjectIdFilter) {
      topicsQuery.where('subject_id', subjectIdFilter)
    }

    const allTopics = await topicsQuery

    // Build hierarchical tree structure
    const topicMap = new Map<string, any>()
    const rootTopics: any[] = []

    for (const t of allTopics) {
      topicMap.set(t.id, {
        id: t.id,
        name: t.name,
        subjectId: t.subjectId,
        parentId: t.parentId,
        level: t.level,
        children: [],
      })
    }

    for (const t of allTopics) {
      const node = topicMap.get(t.id)
      if (t.parentId && topicMap.has(t.parentId)) {
        topicMap.get(t.parentId).children.push(node)
      } else {
        rootTopics.push(node)
      }
    }

    return inertia.render<any>('topics/topics_page', {
      subjects: subjects.map((s) => ({ id: s.id, name: s.name })),
      topics: rootTopics,
    })
  }
}

import { Controller } from '#core/ports/index'
import { HttpContext } from '@adonisjs/core/http'
import { AcademicTopicModel } from '../../infra/db/models/index.js'

export class UpdateTopicController implements Controller<HttpContext> {
  async perform(ctx: HttpContext): Promise<any> {
    const { params, request, response, session, i18n } = ctx

    const topic = await AcademicTopicModel.find(params.id)
    if (!topic) {
      if (request.header('x-inertia')) {
        session.flash('alert', {
          success: false,
          message: i18n.formatMessage('academic.errors.topic_not_found'),
        })
        return response.redirect().back()
      }
      return response.notFound({ message: 'Tópico não encontrado' })
    }

    const { name, parentId, position } = request.only(['name', 'parentId', 'position'])
    if (name) topic.name = name
    if (parentId !== undefined && parentId !== topic.id) topic.parentId = parentId || null
    if (position !== undefined) topic.position = position

    await topic.save()

    if (request.header('x-inertia')) {
      session.flash('alert', {
        success: true,
        message: i18n.formatMessage('academic.topic.updated_success'),
      })
      return response.redirect().back()
    }

    return response.ok({
      message: 'Tópico atualizado com sucesso!',
      topic: {
        id: topic.id,
        name: topic.name,
        parentId: topic.parentId,
        level: topic.level,
      },
    })
  }
}

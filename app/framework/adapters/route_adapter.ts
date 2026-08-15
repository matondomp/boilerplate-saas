import { HttpContext } from '@adonisjs/core/http'

import { Controller } from '#core/ports/index'
import {
  CaptureErrorDecorator,
  ControllerMetaData,
} from '../decorators/capture_errors_decorator.js'

export const routeAdapter = (
  controller: Controller<HttpContext>,
  meta: ControllerMetaData,
  _redirectBack: boolean = true
) => {
  return async (ctx: HttpContext) => new CaptureErrorDecorator(controller, meta).perform(ctx)
}

import { ViewLogsPresenter } from '../ports/view_logs_presenter.js'

export class ViewLogsWebPresenter implements ViewLogsPresenter.Contract {
  perform({ httpContext, useCaseOutput }: ViewLogsPresenter.Input): any {
    return httpContext.inertia.render<any>('view_logs/view_logs_page', {
      logs: useCaseOutput,
    })
  }
}

import { ViewLogsPresenter } from '../ports/view_logs_presenter.js'

export class ViewLogsRestPresenter implements ViewLogsPresenter.Contract {
  perform({ httpContext, useCaseOutput }: ViewLogsPresenter.Input): any {
    return httpContext.response.ok(useCaseOutput)
  }
}

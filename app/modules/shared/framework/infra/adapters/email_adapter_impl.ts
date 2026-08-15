import mjml from 'mjml'
import { Edge } from 'edge.js'
import { resolve } from 'node:path'

import { EmailAdapter } from '#shared/domain/ports/index'
import { getCurrentDir } from '#start/utils/current_dir'

export class EmailAdapterImpl implements EmailAdapter {
  private readonly edge: Edge = new Edge({ cache: false })

  constructor(path?: string) {
    if (path) {
      this.edge.mount(path)
      return
    }

    this.edge.mount(resolve(getCurrentDir(import.meta.url), '..', './resource'))
  }

  async render(emailPath: any, vars: any): Promise<string> {
    const html = await this.edge.render(emailPath, vars)
    return mjml(html).html
  }
}

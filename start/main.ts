import { resolve } from 'node:path'

import './routes/std.js'
import app from '@adonisjs/core/services/app'
import { loadContext } from './utils/load_context.js'

const loadFiles = async (path: string, pattern: any) => {
  const req = loadContext(path, true, pattern)

  for (const filename of req.keys()) {
    await import(filename)
  }
}

const paths = ['app/modules']

for (const path of paths) {
  await loadFiles(resolve(app.appRoot.pathname, path), /main\/events\.(ts|js)$/)
  await loadFiles(resolve(app.appRoot.pathname, path), /main\/startup\.(ts|js)$/)
  await loadFiles(resolve(app.appRoot.pathname, path), /main\/routes\.(ts|js)$/)
}

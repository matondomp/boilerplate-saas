import env from '#start/env'

import { join } from 'node:path'
import { userInfo } from 'node:os'
import { existsSync, mkdirSync } from 'node:fs'

export const prepareStorage = (_public?: boolean): string => {
  const homedir = userInfo().homedir
  const appName = env.get('APP_NAME', 'orion')
  const rootDir = join(homedir, appName)
  const uploadDir = join(rootDir, 'uploads')
  const publicDir = join(rootDir, 'public')

  if (!existsSync(rootDir)) {
    mkdirSync(rootDir)
  }

  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir)
  }

  if (!existsSync(publicDir)) {
    mkdirSync(publicDir)
  }

  return _public ? publicDir : uploadDir
}

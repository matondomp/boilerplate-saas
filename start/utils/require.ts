import app from '@adonisjs/core/services/app'
import { createRequire } from 'node:module'
export const require = createRequire(app.appRoot)

import type { HttpContext } from '@adonisjs/core/http'
import { existsSync, writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

export default class SwaggerCheck {
  public async handle({}: HttpContext, next: () => Promise<void>) {
    const swaggerDirPath = join(process.cwd(), 'resources', 'docs')
    const swaggerFilePath = join(swaggerDirPath, 'swagger.json')
    if (!existsSync(swaggerDirPath)) {
      mkdirSync(swaggerDirPath, { recursive: true })
    }
    if (!existsSync(swaggerFilePath)) {
      const defaultSwaggerContent = {
        openapi: '3.0.0',
        info: {
          title: 'API Documentation',
          version: '1.0.0',
        },
        paths: {},
      }
      writeFileSync(swaggerFilePath, JSON.stringify(defaultSwaggerContent, null, 2))
    }
    await next()
  }
}

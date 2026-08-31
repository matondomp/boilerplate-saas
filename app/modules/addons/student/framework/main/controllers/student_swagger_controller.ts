import { Controller } from '#core/ports/index'
import { HttpContext } from '@adonisjs/core/http'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export class StudentSwaggerController implements Controller<HttpContext> {
  async perform(ctx: HttpContext): Promise<any> {
    const { request, response } = ctx
    const specPath = join(__dirname, '../docs/student_swagger_spec.json')
    const swaggerSpec = JSON.parse(readFileSync(specPath, 'utf-8'))

    if (request.url().endsWith('/json')) {
      return response.ok(swaggerSpec)
    }

    const html = `
<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <title>Módulo Student — Swagger API Docs</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
  <style>
    body { margin: 0; padding: 0; background: #fafafa; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
    window.onload = () => {
      window.ui = SwaggerUIBundle({
        spec: ${JSON.stringify(swaggerSpec)},
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIBundle.SwaggerUIStandalonePreset
        ],
      })
    }
  </script>
</body>
</html>
    `
    return response.header('Content-Type', 'text/html').send(html)
  }
}

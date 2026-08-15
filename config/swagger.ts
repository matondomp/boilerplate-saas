import { SwaggerConfig } from 'adonisjs-6-swagger'

export default {
  uiEnabled: true,
  uiUrl: 'docs',
  specEnabled: true,
  specUrl: '/swagger.json',

  middleware: [],

  options: {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'API Documentation',
        version: '1.0.0',
        description: 'My application with swagger docs',
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
      tags: [
        { name: 'AUTH', description: 'Authentication operations' },
        { name: 'ACCOUNTING', description: 'Accounting module operations' },
      ],
    },

    apis: ['app/**/*.yml', 'resources/docs/swagger/**/*.yml', 'resources/docs/swagger/**/*.json'],
    basePath: '/',
  },
  mode: process.env.NODE_ENV === 'production' ? 'PRODUCTION' : 'RUNTIME',
  specFilePath: 'resources/docs/swagger.json',
} as SwaggerConfig

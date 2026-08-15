import { routeAdapter } from '#app/adapters/route_adapter'
import router from '@adonisjs/core/services/router'
import {
  makeLogoutApiFactory,
  makeLogoutWebController,
  makeResetPasswordFactory,
  makeSendResetPasswordController,
  makeSignApiInController,
  makeSignInViewController,
} from './factories/index.js'
import { middleware } from '#start/kernel'
import { makeAuthMeController } from './factories/sign_in/auth_me_rest_factory.js'

router
  .group(() => {
    router
      .get('/', ({ response }) => {
        return response.redirect().toRoute('admin.common.dashboard')
      })
      .middleware([middleware.guest()])
      .as('index')

    router
      .get(
        '/login',
        routeAdapter(
          {
            perform: async ({ inertia }) => inertia.render('login/login_page'),
          },
          {
            operation: 'view-login-page',
            description: '[Auth] View login page',
          }
        )
      )

      .middleware([middleware.guest()])
      .as('login')

    router
      .get(
        '/reset/password',
        routeAdapter(
          {
            perform: async ({ inertia }) => {
              return inertia.render('reset_password/send_reset_password_link_page')
            },
          },
          {
            operation: 'view-reset-password-notification-page',
            description: '[Auth] View send reset password notification page',
          }
        )
      )
      .as('reset-password')

    router
      .get('/reset/password/:token', ({ params, inertia }) => {
        const { token } = params

        return inertia.render('reset_password/reset_password_page', { token })
      })
      .as('reset-password.token')

    router
      .post(
        '/reset/send-mail',
        routeAdapter(makeSendResetPasswordController(), {
          operation: 'send-reset-password-mail',
          description: '[Auth] A user can ask for a recovery token',
        })
      )
      .as('reset-password.send-mail')

    router
      .post(
        '/reset/password',
        routeAdapter(makeResetPasswordFactory(), {
          operation: 'reset-password',
          description: '[Auth] Reset a user password using token and password',
        })
      )
      .as('reset-password.do')

    router
      .post(
        '/login',
        routeAdapter(makeSignInViewController(), {
          operation: 'do-login',
          description: '[Auth] Authenticate a user',
        })
      )
      .as('login.do')

    router
      .post(
        '/logout',
        routeAdapter(makeLogoutWebController(), {
          operation: 'do-logout',
          description: '[Auth] Logout a user',
        })
      )
      .middleware([middleware.auth()])
      .as('logout.do')
  })
  .prefix('/security/auth')
  .as('security.auth')

router
  .group(() => {
    router
      .group(() => {
        router.post(
          'login',
          routeAdapter(makeSignApiInController(), {
            operation: 'api-do-login',
            description: '[API::Auth] Autenticate a user',
          })
        )
        router
          .post(
            'logout',
            routeAdapter(makeLogoutApiFactory(), {
              operation: 'api-do-logout',
              description: '[API::Auth] Logout a user',
            })
          )
          .middleware([middleware.auth({ guards: ['api'] })])
      })
      .prefix('/security/auth')
    router
      .group(() => {
        router.get(
          'me',
          routeAdapter(makeAuthMeController(), {
            operation: 'api-get-user-auth',
            description: '[API::Auth] Get user autenticated',
          })
        )
      })
      .prefix('/auth')
      .middleware([middleware.auth({ guards: ['api'] })])
  })
  .prefix('/api')

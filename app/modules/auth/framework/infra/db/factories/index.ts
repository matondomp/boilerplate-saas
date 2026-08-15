import Factory from '@adonisjs/lucid/factories'
import { TokenModel } from '../models/token_model.js'
import { TokenTypes } from '#modules/auth/domain/index'
import { DateTime } from 'luxon'

export const TokenFactory = Factory.define(TokenModel, ({ faker }) => ({
  type: TokenTypes.RECOVER_PASSWORD,
  token: faker.string.alpha(32),
  isRevoked: false,
  expiresAt: DateTime.fromJSDate(faker.date.soon({ days: 25 })),
}))
  .merge((token, attributes, _ctx) => {
    token.merge(attributes)
  })
  .state('expired', (token, { faker }) => {
    token.expiresAt = DateTime.fromJSDate(faker.date.recent({ days: 1 }))
  })
  .build()

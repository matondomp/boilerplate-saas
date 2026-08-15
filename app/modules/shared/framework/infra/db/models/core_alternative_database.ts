import { mongodb } from '#app/db/mongodb/index'
import env from '#start/env'

export const CoreAlternativeDatabase = mongodb.query(env.get('APP_NAME', '@core'))

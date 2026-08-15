import { InboxProcessorContract } from '#shared/domain/ports/index'
import { UniqueEntityID } from '#core/domain/index'
import { CoreUserActivity } from '#shared/framework/infra/db/index'
import { HashAdapter } from '#modules/auth/usecases/index'
import { Secret } from '@adonisjs/core/helpers'

export interface ActivityProps {
  operation: string
  sessionId: string
  method?: string
  ip: string
  success: boolean
  error?: string
  payload?: any
  createdAt: Date
}

interface ActivityUserProps extends ActivityProps {
  userId?: UniqueEntityID
}

export class SaveActivityProcessor implements InboxProcessorContract<ActivityUserProps> {
  constructor(private readonly hashAdapter: HashAdapter) { }

  private secretWords = ['password', 'code', '_csrf']

  async perform(input: ActivityUserProps): Promise<void> {
    const lastActivityInThisSession = await CoreUserActivity.find({
      sessionId: input.sessionId,
    })
      .sort('createdAt', -1)
      .limit(1)
      .toArray()

    const isSameOperation =
      lastActivityInThisSession.length &&
      lastActivityInThisSession[0].operation === input.operation &&
      input.success !== lastActivityInThisSession[0].success

    if (isSameOperation) {
      return
    }

    if (!input.success && lastActivityInThisSession[0]) {
      await CoreUserActivity.updateOne(
        {
          _id: lastActivityInThisSession[0]._id,
        },
        {
          $set: {
            success: false,
          },
        }
      )

      return
    }

    if (input.payload) {
      for (const [key, value] of Object.entries(input.payload)) {
        if (typeof value === 'string' && this.secretWords.includes(key)) {
          input.payload[key] = new Secret(value).toString()
        }
      }
    }

    await CoreUserActivity.insertOne({
      ...input,
      userId: input.userId?.toString() ?? null,
      hash: await this.hashAdapter.generate(input.sessionId, 'track_user_activity'),
      createdAt: new Date(input.createdAt),
    })
  }
}

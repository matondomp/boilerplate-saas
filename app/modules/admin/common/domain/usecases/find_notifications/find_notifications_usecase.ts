import { UseCase } from '#core/domain/index'
import { FindNotificationsUseCaseOutput } from './find_notifications_usecase_output.js'

export type FindNotificationsUseCase = UseCase<{ userId: string }, FindNotificationsUseCaseOutput>

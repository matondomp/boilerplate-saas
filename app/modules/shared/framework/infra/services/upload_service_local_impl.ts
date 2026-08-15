import type { MultipartFile } from '@adonisjs/core/bodyparser'

import { join } from 'node:path'

import { UploadService } from '../../main/ports/upload_service.js'
import { prepareStorage } from '#start/utils/prepare_local_storage'

export class UploadServiceLocalImpl implements UploadService {
  async upload(
    avatar: MultipartFile,
    path: string,
    name?: string,
    _public?: boolean
  ): Promise<string> {
    const storagePath = prepareStorage(_public)

    await avatar.move(join(storagePath, path), { name })

    return `/${_public ? 'public' : 'uploads'}/${path}/${avatar.fileName}`
  }
}

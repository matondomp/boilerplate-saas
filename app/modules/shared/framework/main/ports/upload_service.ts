import type { MultipartFile } from '@adonisjs/core/bodyparser'

export interface UploadService {
  upload(avatar: MultipartFile, path: string, name?: string, _public?: boolean): Promise<string>
}

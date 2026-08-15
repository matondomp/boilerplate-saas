import path from 'node:path'
import { fileURLToPath } from 'node:url'

export function getCurrentDir(url: string): string {
  return path.dirname(fileURLToPath(url))
}

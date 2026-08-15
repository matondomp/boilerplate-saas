import { readdirSync, statSync } from 'node:fs'
import { resolve } from 'node:path'

export const loadContext = (
  base = '.',
  scanSubDirectories = false,
  regularExpression = /\.ts$/
) => {
  const files = {} as Record<string, boolean>

  function readDirectory(directory: string) {
    readdirSync(directory).forEach((file) => {
      const fullPath = resolve(directory, file)

      if (statSync(fullPath).isDirectory()) {
        if (scanSubDirectories) {
          readDirectory(fullPath)
        }

        return
      }

      if (!regularExpression.test(fullPath)) {
        return
      }

      files[fullPath] = true
    })
  }

  readDirectory(resolve(import.meta.url, '..', base.replace('@', '')))

  function Module(file: string) {
    return import(file)
  }

  Module.keys = () => Object.keys(files)

  return Module
}

import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

export function getDirectories(srcpath: string): any {
  return readdirSync(srcpath)
    .map((file) => join(srcpath, file))
    .filter((path) => statSync(path).isDirectory())
}

export const loadDirectories = (base = '.') => {
  function flatten(lists: string[]) {
    return lists.reduce((a, b) => a.concat(b), [] as string[])
  }

  function getDirectoriesRecursive(srcpath: string): string[] {
    return [srcpath, ...flatten(getDirectories(srcpath).map(getDirectoriesRecursive))]
  }

  return getDirectoriesRecursive(base)
}

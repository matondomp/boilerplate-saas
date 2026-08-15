import { exec } from 'node:child_process'
import util from 'node:util'

const execCommand = util.promisify(exec)

export default execCommand

import { ChildProcess, exec, spawn } from 'child_process'
import { chmod, readFile, stat, writeFile } from 'fs/promises'
import { platform } from 'os'
import { basename, dirname, join } from 'path'
import type { ClientOptions } from '../types/client'

export class Client {
  private static exec: string
  public readonly log: boolean = false
  public readonly directory
  public readonly singleThread
  public readonly workerThreads
  public readonly concurrentInitLimit
  public port
  public child?: ChildProcess
  public pid?: number
  public version?: string
  private retries = 5

  constructor(options: ClientOptions) {
    this.port = options.port
    this.directory = options.directory
    this.singleThread = options.singleThread
    this.workerThreads = options.workerThreads
    this.concurrentInitLimit = options.concurrentInitLimit
    if (options.log !== undefined) this.log = options.log
  }

  static setExecPath (path: string) {
    Client.exec = path
  }

  stop () {
    if (this.child) {
      this.child.kill('SIGTERM')
      this.child = undefined
    } else if (this.pid) {
      process.kill(this.pid, 'SIGTERM')
      this.pid = undefined
    }
  }

  async start () {
    if (!(await this.exist(Client.exec))) throw new Error('rqbit executable not found!')
    chmod(Client.exec, 0o755)

    const rulePath = platform() === 'win32' ? '.\\' : './'
    const version = this.getVersion(await this.execAsync(`${Client.exec} --version`))

    if (this.port === undefined) this.port = this.getRandomPort()
    if (!version) throw new Error('Could not detect rqbit version')
    this.version = version

    const existingProcess = await this.findExistingProcess()
    if (existingProcess) {
      const pathInstance = join(process.cwd(), 'rqbit-instance.json')
      if (await this.exist(pathInstance)) {
        const content = JSON.parse(await readFile(pathInstance, { encoding: 'utf-8' })) as { pid: number, port: number }

        this.pid = existingProcess
        this.port = content.port
        return
      } else {
        process.kill(existingProcess, 'SIGTERM')
      }
    }
 
    let attempt = 0
    while (attempt < this.retries) {
      const args = ['--http-api-listen-addr', `127.0.0.1:${this.port}`, 'server', 'start', `${rulePath}${this.directory}`]

      try {
        const child = spawn(`${rulePath}${basename(Client.exec)}`, args, {
          cwd: dirname(Client.exec)
        })
    
        if (this.log) {
          child.stdout.on('data', (data: Buffer) => {
            console.log(data.toString())
          })
          
          child.stderr.on('data', (data: Buffer) => {
            console.log(data.toString())
          })
        }

        const result = await new Promise<boolean>((resolve, reject) => {
          child.stdout.on('data', (data: Buffer) => {
            if (data.toString().includes('starting HTTP API at')) {
              setTimeout(() => resolve(true), 2000)
            }
          })

          child.stdout.on('data', (data: Buffer) => {
            if (data.toString().includes('error binding')) reject(false)
          })

          child.on('close', (code) => code === 0
            ? resolve(false)
            : reject(new Error(`Faild start api, with code ${code}`))
          )
        })

        if (result) {
          this.child = child
          this.pid = child.pid
          
          await writeFile(
            'rqbit-instance.json',
            JSON.stringify({
              pid: child.pid,
              port: this.port
            }, null, 2), { 
              encoding: 'utf-8'
            })
          break
        }
      } catch (error) {
        console.log(`Port start error ${this.port}: ${error}`)
        attempt++
        this.port = this.getRandomPort()

        if (attempt === this.retries) throw new Error('Maximum number of attempts reached. The server could not be started')
      }
    }
  }

  private async findExistingProcess (): Promise<number| null> {
    const execName = basename(Client.exec)

    switch (platform()) {
    case 'win32': {
      const stdout = await this.execAsync(`tasklist /FI "IMAGENAME eq ${execName}"`)
      const lines = stdout.split('\n').filter((line) => line.includes(execName))
      
      if (lines.length > 0) {
        const pid = parseInt(lines[0].trim().split(/\s+/)[1], 10)
        return pid
      }
      break
    }
    case 'linux': {
      try {
        const stdout = await this.execAsync(`ps -eo pid,comm | grep "${execName}" | grep -v "grep"`)
        const lines = stdout.split('\n').filter(Boolean)
  
        if (lines.length > 0) {
          const pid = parseInt(lines[0].trim().split(/\s+/)[0], 10)
          return pid
        }
      } catch {
        return null
      }
    }
    }
    return null
  }

  private getRandomPort() {
    return Math.floor(Math.random() * (65535 - 1024 + 1)) + 1024
  }

  private getVersion(content: string) {
    const math = content.match(/\d+\.\d+\.\d+/)
    return math ? math[0] : null
  }

  private execAsync (command: string) {
    return new Promise<string>((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) reject(stderr || error)
        resolve(stdout)
      })
    })
  }

  private async exist (path: string) {
    try {
      return (await stat(path)).isFile()
    } catch {
      return false
    }
  }
}
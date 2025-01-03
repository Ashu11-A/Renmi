import 'dotenv/config'
import 'reflect-metadata'

import { execSync } from 'child_process'
import { Client as ClientNyaa } from 'nyaa'
import { join } from 'path'
import { Client as ClientTorrent, Wrapper } from 'torrent'
import { Fastify } from './controllers/fastify.js'
import { Router } from './controllers/router.js'
import Database from './database/dataSource.js'

execSync('bun run migration:run || true', { stdio: 'inherit' })

export const nyaaClient = new ClientNyaa()
await nyaaClient.init()
await nyaaClient.config()

ClientTorrent.setExecPath(join(process.cwd(), 'rqbit-linux'))
export const clientTorrent = new ClientTorrent({
  directory: process.env['TORRENT_PATH'] || join(process.cwd(), 'torrents'),
  port: Number(process.env['TORRENT_PORT']) || 9090,
  log: true
})
await clientTorrent.start()
export const wrapperTorrent = new Wrapper(clientTorrent)

const fastify = new Fastify({ port: Number(process.env['PORT']) || 3000, host: '0.0.0.0' })
await Database.initialize()


fastify.init()
await Router.register()
fastify.listen()

// await Database.dropDatabase()
// await BetQueue.removeAllRepeatable()
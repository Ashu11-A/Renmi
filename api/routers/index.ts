import { Router } from '../src/controllers/router.js'
import pkg from '../package.json' assert { type: 'json' }
import { MethodType } from '../src/types/router.js'
import Database from '../src/database/dataSource.js'
import { clientTorrent } from '../src/app.js'

export default new Router({
  name: 'Home',
  description: 'Home API',
  method: [
    {
      type: MethodType.Get,
      async run(_request, reply) {
        const routers: Record<string, string[]> = {}

        for (const router of Router.all) {
          routers[router.options.path as string] = router.options.method.map((method) => method.type)
        }

        return reply.code(200).send({
          message: 'Hello!',
          data: {
            name: pkg.name,
            version: pkg.version,
            database: Database.isInitialized,
            torrent: clientTorrent.pid !== undefined || clientTorrent.child !== undefined,
            routers,
          }
        })
      }
    }
  ]
}) 
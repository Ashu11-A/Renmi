import { clientTorrent } from '../../src/app.js'
import { Router } from '../../src/controllers/router'
import { MethodType } from '../../src/types/router'

export default new Router({
  name: 'Kill Torrent!',
  description: 'Kill process of Torrent!',
  method: [
    {
      type: MethodType.Post,
      async run(request, reply) {
        if (clientTorrent.pid === undefined) {
          return reply.code(422).send({
            message: 'The Torrent process is not running!'
          })
        }

        clientTorrent.stop()
        if (clientTorrent.pid === undefined) {
          return reply.code(200).send({
            message: 'Torrent successfully stopped!'
          })
        }

        return reply.code(422).send({
          message: 'We couldn\'t stop the Torrent service!'
        })
      },
    }
  ]
})
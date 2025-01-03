import { clientTorrent } from '../../src/app'
import { Router } from '../../src/controllers/router'
import { MethodType } from '../../src/types/router'

export default new Router({
  name: 'Start Torrent!',
  description: 'Start process of Torrent!',
  method: [
    {
      type: MethodType.Post,
      async run(_, reply) {
        if (clientTorrent.pid !== undefined) {
          return reply.code(422).send({
            message: 'The torrent service is now up and running!'
          })
        }

        await clientTorrent.start()
        if (clientTorrent.pid === undefined) {
          return reply.code(200).send({
            message: 'An error occurred when starting the torrent service'
          })
        }

        return reply.code(422).send({
          message: 'Torrent service successfully initialized!'
        })
      },
    }
  ]
})
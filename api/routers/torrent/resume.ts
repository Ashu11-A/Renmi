import { z } from 'zod'
import { Router } from '../../src/controllers/router'
import { MethodType, type MethodRequests } from '../../src/export'
import { wrapperTorrent } from '../../src/app'
import { WrapperError } from 'torrent'

const schema = z.object({
  uuid: z.string().or(z.number())
})

export default new Router({
  name: 'Resume Torrent',
  description: 'Resume Torrent by uuid',
  method: [
    {
      type: MethodType.Post,
      async run(request, reply) {
        const validation = schema.safeParse(request.body)

        if (!validation.success) {
          return reply.code(400).send({
            message: validation.error.message,
            zod: validation.error
          } satisfies MethodRequests['/torrent/resume']['Post']['400'])
        }

        const paused = wrapperTorrent.start(validation.data.uuid)

        if (paused instanceof WrapperError) {
          return reply.code(422).send({
            message: 'Couldn\'t resume the torrent!'
          } satisfies MethodRequests['/torrent/resume']['Post']['422'])
        }

        return reply.code(200).send({
          message: 'Torrent resumed successfully!',
          data: {
            [validation.data.uuid]: paused
          }
        })
      }
    }
  ]
})
import { WrapperError } from 'torrent'
import { z } from 'zod'
import { wrapperTorrent } from '../../src/app'
import { Router } from '../../src/controllers/router.js'
import { MethodType } from '../../src/types/router.js'
import type { MethodRequests } from '../../src/types/routes.js'

const schema = z.object({
  uuid: z.string().or(z.number())
})

const schemaCreate = z.object({
  magnet: z.string(),
  overwrite: z.boolean().optional()
})

export default new Router({
  name: 'Torrent',
  description: 'Manager Torrent System',
  method: [
    {
      type: MethodType.Get,
      async run(request, reply) {
        const torrents = await wrapperTorrent.getTorrents()

        if (torrents instanceof WrapperError) {
          return reply.code(422).send({
            message: torrents.message
          })
        }

        const data = []

        for (const torrent of torrents) {
          data.push({
            info: await torrent.info(),
            stats: await torrent.stats()
          })
        }

        return reply.code(200).send({
          message: 'Request successfully completed!',
          data: data
        } satisfies MethodRequests['/torrent']['Get']['200'])
      },
    },
    {
      type: MethodType.Post,
      async run(request, reply) {
        const validation = schemaCreate.safeParse(request.body)

        if (!validation.success) {
          return reply.code(400).send({
            message: validation.error.message,
            zod: validation.error
          } satisfies MethodRequests['/torrent']['Post']['400'])
        }

        const torrent = await wrapperTorrent.add({
          magnet: validation.data.magnet,
          overwrite: validation.data.overwrite
        })

        if (torrent instanceof WrapperError) {
          return reply.code(422).send({
            message: torrent.message
          } satisfies MethodRequests['/torrent']['Post']['422'])
        }

        return reply.code(201).send({
          message: 'Successfully added!',
          data: torrent
        } satisfies MethodRequests['/torrent']['Post']['201'])
      },
    },
    {
      type: MethodType.Delete,
      async run(request, reply) {
        const validation = schema.safeParse(request.body)

        if (!validation.success) {
          return reply.code(400).send({
            message: validation.error.message,
            zod: validation.error,
          })
        }

        const deleted = await wrapperTorrent.delete(validation.data.uuid)

        if (deleted instanceof WrapperError) {
          return reply.code(404).send({
            message: deleted.message
          } satisfies MethodRequests['/torrent']['Delete']['404'])
        }
        return reply.code(200).send({
          message: 'Successfully deleted!',
          data: {
            [validation.data.uuid]: deleted
          }
        } satisfies MethodRequests['/torrent']['Delete']['200'])
      },
    }
  ]
})
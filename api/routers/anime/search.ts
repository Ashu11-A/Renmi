import { z } from 'zod'
import { Router } from '../../src/controllers/router'
import { MethodType } from '../../src/export'
import { clientGraphQL, searchAnime, searchAnimes } from 'anilist'

const schema = z.object({
  animeId: z.number().optional(),
  animeName: z.string().optional(),
  list: z.boolean().optional()
})

export default new Router({
  name: 'Search Anime',
  description: 'Search espefic anime by name',
  method: [
    {
      type: MethodType.Post,
      async run(request, reply) {
        const validation = schema.safeParse(request.body)

        if (!validation.success) {
          return reply.code(400).send({
            message: validation.error.message,
            zod: validation.error
          })
        }

        const result = await clientGraphQL.request(validation.data.list ? searchAnimes : searchAnime, { search: validation.data.animeName, mediaId: validation.data.animeId })
        return reply.code(200).send({
          message: 'Request sucess!',
          data: result
        })
      },
    }
  ]
})
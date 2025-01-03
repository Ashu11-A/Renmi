import { Scraper } from 'nyaa'
import { z } from 'zod'
import { nyaaClient } from '../../src/app'
import { Router } from '../../src/controllers/router'
import { MethodType } from '../../src/export'

const schema = z.object({
  name: z.string()
})

export default new Router({
  name: 'Nyaa.si Search',
  description: 'Search by name anime',
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

        const scraper = new Scraper(nyaaClient)
        await scraper.init()
        await scraper.search(validation.data.name)
        const result = (await scraper.extract())

        return reply.code(200).send({
          message: 'Successful survey!',
          data: {
            ...result,
            data: result.data.filter((torrent) => (torrent.category.toLowerCase()).includes('anime'))
          }
        })
      },
    }
  ]
})
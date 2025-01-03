import { clientGraphQL, searchAnimes } from 'anilist'
import { MediaSort } from 'anilist/src/gql/graphql'
import { Router } from '../../src/controllers/router'
import { MethodType } from '../../src/export'

export default new Router({
  name: 'Get Trends Animes',
  description: 'Search espefic anime by name',
  method: [
    {
      type: MethodType.Get,
      async run(_, reply) {
        const result = await clientGraphQL.request(searchAnimes, { sort: MediaSort.TrendingDesc })
        return reply.code(200).send({
          message: 'Request sucess!',
          data: result
        })
      },
    }
  ]
})
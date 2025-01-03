import { AnimeBox } from '@/components/box/AnimeBox'
import { useQuery } from '@tanstack/react-query'
import { createLazyFileRoute } from '@tanstack/react-router'
import { fetch } from '@tauri-apps/plugin-http'
import { MediaTag, SearchAnimesQuery, StudioConnection } from 'anilist'

export const Route = createLazyFileRoute('/explore')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data } = useQuery({
    queryKey: ['anilist', 'trends'],
    initialData: [],
    queryFn: async () => {
      const request = await fetch('http://localhost:4000/anime/trends', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const content = await request.json()
      console.log(content)
      return (content as { data: SearchAnimesQuery }).data.Page?.media
    }
  })

  return (
    <div
      className='grid lg:grid-cols-8 md:grid-cols-3 grid-cols-2 gap-5'
    >
      {data?.map((anime) => (anime?.id && anime?.title?.english && (anime?.coverImage?.extraLarge || anime.coverImage?.medium)) &&
      <AnimeBox
        key={anime.id}
        id={anime.id}
        title={anime.title.english}
        year={anime.seasonYear as number}
        studios={anime.studios as StudioConnection}
        season={anime.season ?? undefined}
        tags={anime.tags?.filter((tag) => tag !== null && tag !== undefined) as MediaTag[]}
        coverImage={(anime?.coverImage?.extraLarge ?? anime.coverImage?.medium) as string}
        color={anime.coverImage.color ?? undefined}
        bannerImage={anime.bannerImage ?? undefined}
      />
      )}
    </div>
  )
}

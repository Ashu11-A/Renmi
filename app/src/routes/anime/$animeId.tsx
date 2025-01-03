import { AnimeContainer } from '@/components/box/AnimeContainer'
import { NyaaBox } from '@/components/box/NyaaBox'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { fetch } from '@tauri-apps/plugin-http'
import { SearchAnimeQuery } from 'anilist'

export const Route = createFileRoute('/anime/$animeId')({
  component: RouteComponent
})

function RouteComponent() {
  const { animeId } = Route.useParams()
  const { data: anilist, isLoading } = useQuery({
    queryKey: ['anilist', Number(animeId)],
    queryFn: async () => {
      const request = await fetch('http://localhost:4000/anime/search', {
        method: 'POST',
        body: JSON.stringify({
          animeId: Number(animeId)
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
    
      const content = await request.json()
      console.log(content)
      return (content as { data: SearchAnimeQuery }).data?.Media
    }
  })

  if (anilist === undefined || anilist?.id === undefined || !anilist.title?.english) {
    return <></>
  }

  return <div className='flex flex-1 flex-col'>
    <AnimeContainer {...anilist}  isLoading={isLoading} />
    <NyaaBox animeName={anilist.title.english} anilistId={anilist.id} />
  </div>
}

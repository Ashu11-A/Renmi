import { useImage } from '@/hooks/useImage'
import { getTextColorBasedOnContrast } from '@/lib/contrast'
import { cn } from '@/lib/utils'
import { SearchAnimeQuery } from 'anilist'
import parse from 'html-react-parser'
import { Skeleton } from '../ui/skeleton'

export type AnimeData = NonNullable<SearchAnimeQuery>['Media']

export function AnimeContainer (anime: AnimeData & { isLoading: boolean }) {
  const { url: coverSrc } = useImage({ id: anime?.id as number, type: 'cover', source: anime?.coverImage?.extraLarge ?? anime?.coverImage?.medium ?? undefined })
  const { url: bannerSrc } = useImage({ id: anime?.id as number, type: 'banner', source: anime?.bannerImage ?? undefined })

  return (
    <div className="flex flex-col flex-1">
      <div className='relative w-full pb-[15%] lg:mb-24 md:mb-32 mb-36'>
        {anime.isLoading
          ? <Skeleton 
            className={cn(
              'absolute rounded-2xl z-[99999]',
              'w-full h-full'
            )}
          />
          : <img
            src={bannerSrc}
            className={cn(
              'absolute rounded-2xl object-cover',
              'w-full h-full'
            )}
            alt="Banner Anime"
          />
        }

        {anime.isLoading
          ? <Skeleton 
            className={cn(
              'absolute rounded-xl z-[99999]',
              'top-[25%] left-[5%]',
              'lg:w-[10%] md:w-[15%] w-[25%]',
              'aspect-[11/16]'
            )}
          />
          : <img
            src={coverSrc}
            className={cn(
              'absolute rounded-xl object-cover',
              'top-[25%] left-[5%]',
              'lg:w-[10%] md:w-[15%] w-[25%]',
              'aspect-[11/16]'
            )}
            alt="Banner Anime"
          />
        }
      </div>
      <div
        className='flex relative p-8 bg-zinc-800 rounded-2xl'
      >
        <p
          className='absolute -top-5 w-auto h-auto font-semibold p-2 rounded-2xl'
          style={{ 
            backgroundColor: anime?.coverImage?.color ?? undefined,
            color: getTextColorBasedOnContrast(anime?.coverImage?.color ?? '#fffff')
          }}
        >
          {anime?.title?.english ?? anime?.title?.native}
        </p>
        <p>
          {parse(anime?.description ?? 'No description was obtained!')}
        </p>
      </div>
      {String(bannerSrc)}
      {/* {(anime?.trailer?.id && anime?.trailer.site === 'youtube') &&
        <div className='flex flex-col'>
          <p>Trailler</p>
          <iframe
            className='aspect-video'
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; camera; microphone"
            allowFullScreen
            src={`https://www.youtube.com/embed/${anime?.trailer?.id}`}
          >
                
          </iframe>
        </div>
      } */}
    </div>
  )
}
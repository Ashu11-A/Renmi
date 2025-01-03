import { useHover } from '@/hooks/useHover'
import { useImage } from '@/hooks/useImage'
import { useTooltip } from '@/hooks/useTooltip'
import { getTextColorBasedOnContrast } from '@/lib/contrast'
import { cn } from '@/lib/utils'
import { useNavigate } from '@tanstack/react-router'
import { MediaTag, StudioConnection } from 'anilist'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { IoMdAdd } from 'react-icons/io'
import { useTheme } from '../themeProvider'
import { Badge } from '../ui/badge'
import { Skeleton } from '../ui/skeleton'

type AnimeBoxProps = {
  id: number
  title: string
  color?: string
  year: number
  season?: string
  tags: MediaTag[]
  studios: StudioConnection
  coverImage: string
  bannerImage?: string
}

export function AnimeBox ({ id, title, year, season, coverImage, bannerImage, color, tags, studios }: AnimeBoxProps) {
  const { ref: mouseHoverRef, hovering } = useHover<HTMLImageElement>()
  const { url: coverSrc } = useImage({ id, type: 'cover', source: coverImage })
  const { url: bannerSrc } = useImage({ id, type: 'banner', source: bannerImage })
  const { ref: tooltipRef, tooltipPosition } = useTooltip<HTMLDivElement>()
  const { theme } = useTheme()
  const [imageLoaded, setImageLoaded] = useState(false)
  const router = useNavigate()

  return (
    <div
      className={'flex relative flex-col cursor-pointer'}
    >
      <AnimatePresence>
        <div className='relative w-full aspect-[11/16] overflow-hidden rounded-xl'>
          {!imageLoaded && <Skeleton className='absolute w-full h-full z-[999999]' />}
          {coverSrc &&
            <img
              ref={(node) => {
                if (node) {
                  tooltipRef(node)
                  mouseHoverRef(node)
                }
              }}
              onLoad={() => setImageLoaded(true)}
              onClick={() => router({ to: `/anime/${id}` })}
              src={coverSrc}
              className='absolute w-full h-full z-20 top-0 left-0 p-2 object-cover rounded-xl'
              hidden={!imageLoaded}
              alt={`Anime cover image: ${title}`}
            />
          }
          
          {hovering &&
            <motion.img
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              src={coverSrc}
              className='absolute w-full h-full top-0 left-0 blur-3xl opacity-20 object-cover'
            />
          }

          {hovering &&
            <div className='absolute right-5 bottom-5 h-6 w-6 pointer-events-none rounded-full bg-zinc-900 z-50'>
              <IoMdAdd color='white' />
            </div>
          }
        </div>
        <motion.p
          className='ml-2 mt-1 text-sm truncate'
          animate={{
            color: hovering ? color : undefined
          }}
        >
          <p className='font-semibold'>{title}</p>
          {String(imageLoaded)}
        </motion.p>

        {hovering && 
          <motion.div
            className={cn(
              `flex flex-col absolute w-full ${tooltipPosition === 'left' ? 'right-full' : 'left-full'} aspect-square z-40`,
              `top-0 ${tooltipPosition === 'left' ? 'mr-5' : 'ml-5'} gap-2`,
              `${theme === 'dark' ? 'bg-zinc-900' : 'bg-slate-200'} rounded-lg`
            )}
            
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            exit={{
              transition: { duration: 0.05 },
              scale: 0.5
            }}
          >
            <div
              className='flex w-full h-16 overflow-hidden rounded-t-lg'
              style={{ backgroundColor: color }}
            >
              {bannerSrc &&
                <img
                  src={bannerSrc}
                  className='w-full object-cover z-50'
                  alt="About anime"
                />
              }
            </div>
            <div className='flex px-2 gap-2'>
              <p className={'text-sm font-semibold'} style={{ color }}>
                {season}
              </p>
              <p className={'text-sm font-semibold'} style={{ color }}>
                {year}
              </p>
            </div>
            {studios.nodes?.[0]?.name && 
              <div className='flex px-2 gap-2'>
                <p className={'text-sm font-semibold'} style={{ color }}>
                  {studios.nodes[0].name}
                </p>
              </div>
            }
            <div className='flex flex-wrap justify-start px-2 gap-1'>
              {tags
                .filter((tag) => typeof tag.rank === 'number')
                .sort((a, b) => (b.rank as number) - (a.rank as number))
                .slice(0, 5)
                .map((tag) => (
                  <Badge
                    style={{
                      backgroundColor: color,
                      color: getTextColorBasedOnContrast(color ?? '#fffff')
                    }}>
                    {tag.name}
                  </Badge>
                ))}
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </div>
  )
}
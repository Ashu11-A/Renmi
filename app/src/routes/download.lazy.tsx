import { AreYouSure } from '@/components/box/AreYouSure'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Download } from '@/lib/download'
import { useQuery } from '@tanstack/react-query'
import { createLazyFileRoute } from '@tanstack/react-router'
import { fetch } from '@tauri-apps/plugin-http'
import { MethodRequests } from 'api'
import { AnimatePresence } from 'motion/react'
import { useState } from 'react'
import { FiPause, FiTrash } from 'react-icons/fi'
import { IoPlayOutline } from 'react-icons/io5'
import { MdFileDownloadDone } from 'react-icons/md'
import { TorrentInfo } from 'torrent'

export const Route = createLazyFileRoute('/download')({
  component: RouteComponent,
})

function RouteComponent() {
  const { refetch, data } = useQuery({
    queryKey: ['torrent', 'list'],
    initialData: [],
    refetchInterval: 1000,
    refetchIntervalInBackground: true,
    queryFn: async () => {
      const response = await fetch('http://localhost:4000/torrent')
      const content = await response.json()
      
      switch (response.status) {
      case 200: {
        return (content as unknown as MethodRequests['/torrent']['Get']['200']).data
      }
      case 422: {
        throw new Error((content as unknown as MethodRequests['/torrent']['Get']['422']).message)
      }
      default: {
        throw new Error('Server response out of scope')
      }
      }
    }
  })
  const [openAreYouSure, setOpenAreYouSure] = useState<string | null>(null)

  const handleDelete = async (uuid: string | number) => {
    await fetch('http://localhost:4000/torrent', { 
      method: 'DELETE',
      body: JSON.stringify({ uuid }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  
    refetch()
  }

  const handlePause = async (uuid: string | number) => {
    const response = await fetch('http://localhost:4000/torrent/pause', { 
      method: 'POST',
      body: JSON.stringify({ uuid }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    console.log(await response.json())

    refetch()
  }

  const handleResume = async (uuid: string | number) => {
    await fetch('http://localhost:4000/torrent/resume', { 
      method: 'POST',
      body: JSON.stringify({ uuid }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    setOpenAreYouSure(null)
    refetch()
  }

  return (
    <div className='absolute top-0 left-0 w-full'>
      <AnimatePresence>
        {openAreYouSure && (
          <div className='fixed inset-0 flex items-center justify-center min-h-full bg-black/50 backdrop-blur-xl'>
            <AreYouSure
              callback={() => {handleDelete(openAreYouSure); setOpenAreYouSure(null)}}
              close={() => setOpenAreYouSure(null)}
              description={<p className='text-start py-4'>
                Deseja deletar esse Torrent?
                <br/>
                Essa ação não pode ser desfeita. Deseja continuar?
              </p>}
            />
          </div>
        )}
      </AnimatePresence>
      <table className='w-full border-separate border-spacing-2 border border-gray-200 rounded-2xl'>
        <thead>
          <tr className='border border-gray-300'>
            <th className='px-4 py-2 text-center'>Título</th>
            <th className='px-4 py-2 text-center'>Tamanho</th>
            <th className='px-4 py-2 text-center'>Progresso</th>
            <th className='px-4 py-2 text-center'>Data</th>
            <th className='px-4 py-2 text-center'>Ações</th>
          </tr>
        </thead>
        <tbody>
          {data.map((torrent) =>
            !(torrent.info instanceof Error) && !(torrent.stats instanceof Error) && (
              <tr
                key={torrent.info.info_hash}
                className='border border-gray-300'
              >
                <td className='px-4 py-2 text-center'>{torrent.info.name}</td>
                <td className='px-4 py-2 text-center'>
                  {Download.formatBytes(torrent.stats.total_bytes)}
                </td>
                <td className='px-4 py-2 text-center'>
                  <div className='flex items-center justify-center gap-2'>
                    <Progress
                      value={(torrent.stats.progress_bytes / torrent.stats.total_bytes) * 100}
                    />
                    <p>
                      {((torrent.stats.progress_bytes / torrent.stats.total_bytes) * 100).toFixed(2)}%
                    </p>
                  </div>
                </td>
                <td className='px-4 py-2 text-center'>{new Date().toLocaleString()}</td>
                <td className='px-4 py-2 text-center'>
                  <div className='flex justify-center items-center gap-4'>
                    {torrent.stats.finished ? (
                      <Button size={'icon'} variant={'outline'}>
                        <MdFileDownloadDone color='green' />
                      </Button>
                    ) : torrent.stats.state === 'paused' ? (
                      <Button
                        size={'icon'}
                        onClick={() => handleResume((torrent.info as TorrentInfo).info_hash)}
                        variant={'outline'}
                      >
                        <IoPlayOutline color='green' />
                      </Button>
                    ) : (
                      <Button
                        size={'icon'}
                        onClick={() => handlePause((torrent.info as TorrentInfo).info_hash)}
                        variant={'outline'}
                      >
                        <FiPause color='blue' />
                      </Button>
                    )}
                    <Button
                      size={'icon'}
                      onClick={() => setOpenAreYouSure((torrent.info as TorrentInfo).info_hash)}
                      variant={'outline'}
                    >
                      <FiTrash color='red' />
                    </Button>
                  </div>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>

  )
}

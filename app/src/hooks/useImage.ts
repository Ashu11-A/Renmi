import { useQuery } from '@tanstack/react-query'
import { appDataDir, BaseDirectory, join } from '@tauri-apps/api/path'
import { exists, mkdir, readFile, writeFile } from '@tauri-apps/plugin-fs'
import { download } from '@tauri-apps/plugin-upload'
import { useCallback, useEffect } from 'react'

type UseImageProps = {
  type: string
  source?: string
  id: number
}

export function useImage({ id, source, type }: UseImageProps) {
  const getImageFormat = useCallback((url: string) => {
    const match = url.match(/\.(\w+)(?:\?.*)?$/)
    return match ? match[1].toLowerCase() : null
  }, [])

  const createObjectURL = useCallback((buffer: Uint8Array | ArrayBuffer, mimeType: string) => {
    const blod = new Blob([buffer], { type: mimeType })
  
    return URL.createObjectURL(blod)
  }, [])

  const { data } = useQuery({
    queryKey: ['image', id, type],
    queryFn: async () => {
      if (!source) return
  
      const format = getImageFormat(source)
      const path = `cache/animes/${id}/${type}.${format}`
      const mimeType = `image/${format}`

      await mkdir(`cache/animes/${id}`, { baseDir: BaseDirectory.AppData, recursive: true })

      if (await exists(path, { baseDir: BaseDirectory.AppData })) {
        const image = await readFile(path, { baseDir: BaseDirectory.AppData })
        return createObjectURL(image, mimeType)
      }
      
      await download(source, await join(await appDataDir(), path))
      const image = await readFile(path, { baseDir: BaseDirectory.AppCache })

      await writeFile(path, image, { baseDir: BaseDirectory.AppData })
      return createObjectURL(image, mimeType)
    }
  })

  useEffect(() => {
    return () => {
      if (data) URL.revokeObjectURL(data)
    }
  }, [data])

  return { url: data }
}
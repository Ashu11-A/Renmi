import { DownloadEvents, DownloadProps, DownloadType } from '@/types/download'
import type { GithubRelease, ReleaseAsset } from '@/types/github'

export class Download<IsTauri extends boolean, DownloadTyped extends DownloadType> {
  public type: DownloadTyped
  public tauri: IsTauri
  public onStart?: DownloadEvents['onStart']
  public onProgress?: DownloadEvents['onProgress']
  public onComplete?: DownloadEvents['onComplete']

  constructor (public options: {
    type: DownloadTyped,
    tauri: IsTauri
  }
  & DownloadProps<IsTauri, DownloadTyped>
  ) {
    this.type = options.type
    this.tauri = options.tauri
    this.onStart = options.onStart
    this.onProgress = options.onProgress
    this.onComplete = options.onComplete
  }

  async execute () {
    switch (true) {
    case this.isGithub(): {
      const fetch = await this.getFetch()
      const { github } = this.options
      const url = `https://api.github.com/repos/${github.repoOwner}/${github.repoName}/releases${github.latest ? '/latest' : ''}` as const

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/vnd.github+json'
        }
      })

      const data = await response.json() as GithubRelease | GithubRelease[]
      
      const asset = this.findGithubAsset(data, this.options)
      if (!asset) throw new Error(`Not found file of name: ${github.fileName}`)
      
      this.download(asset.browser_download_url)
      break
    }
    case this.isURL(): {
      console.log(this.options.url)
      break
    }
    }
  }
  
  async download(url: string) {
    if (this.tauri) {
      ((await import('@tauri-apps/plugin-upload')).download)(
        url,
        this.options.path,
        ({ progress, progressTotal, total, transferSpeed }) => {
          const porcentage = Math.min(Math.round((progressTotal / total) * 100), 100)

          this.onProgress?.(porcentage, progress, transferSpeed)
        },
        new Map<string, string>().set('Content-Type', 'application/octet-stream')
      ).then(() => {
        if (this.tauri) this.onComplete?.(undefined)
      })
      return
    }
 
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/octet-stream' },
    })
  
    const contentLength = Number(response.headers.get('content-length'))
    if (isNaN(contentLength)) throw new Error('Content length is invalid or undefined')

      
    const reader = response.body?.getReader()
    if (!reader) throw new Error('Failed to retrieve stream reader')
        
    this.onStart?.(url)
        
    const chunks: Uint8Array[] = []
    const maxRateSamples = 5
    const transferRates: number[] = []
    let loadedBytes = 0
    let lastReportedBytes = 0
    let lastReportedTime = Date.now()


    while (true) {
      const { done, value } = await reader.read()

      if (done) {
        const blob = new Blob(chunks)
        if (!this.tauri) {
          (this.onComplete as ((blob: Blob) => void) | undefined)?.(blob)
        }
        break
      }

      if (value) {
        chunks.push(value)
        loadedBytes += value.byteLength

        const currentTime = Date.now()
        let elapsedTime = (currentTime - lastReportedTime) / 1000
        elapsedTime = Math.max(elapsedTime, 0.1) // Avoid division by zero or very low values

        const transferredBytes = loadedBytes - lastReportedBytes
        const transferRate = transferredBytes / elapsedTime

        lastReportedBytes = loadedBytes
        lastReportedTime = currentTime

        transferRates.push(transferRate)
        if (transferRates.length > maxRateSamples) {
          transferRates.shift() // Maintain fixed size for rate samples
        }

        const smoothedRate =
          transferRates.reduce((sum, rate) => sum + rate, 0) / transferRates.length

        const progress = Math.min(Math.round((loadedBytes / contentLength) * 100), 100)
        this.onProgress?.(progress, value.byteLength, Math.round(smoothedRate))
      }
    }
  }

  static formatBytes(bytes: number, decimals = 2): string {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']
    const sizeIndex = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, sizeIndex)).toFixed(decimals))} ${sizes[sizeIndex]}`
  }
  
  async getFetch(): Promise<typeof fetch> {
    return this.tauri
      ? (await import('@tauri-apps/plugin-http')).fetch
      : fetch
  }

  findGithubAsset (
    data: GithubRelease | GithubRelease[],
    options: DownloadProps<IsTauri, DownloadType.GitHub>
  ): ReleaseAsset | undefined {
    const releases = Array.isArray(data) ? data : [data]

    for (const release of releases) {
      const asset = release.assets.find((asset) => {
        const { fileName } = options.github
        return this.isRegex(fileName)
          ? new RegExp(fileName).test(asset.name)
          : fileName === asset.name
      })

      if (asset) return asset
    }
  }

  private isRegex(pattern: string | RegExp): boolean {
    try {
      new RegExp(pattern)
      return true
    } catch {
      return false
    }
  }

  private isGithub(): this is Download<IsTauri, DownloadType.GitHub> {
    return this.type === DownloadType.GitHub
  }
  private isURL(): this is Download<IsTauri, DownloadType.URL> {
    return this.type === DownloadType.URL
  }
}
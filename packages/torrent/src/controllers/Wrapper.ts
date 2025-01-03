import type { Client } from './Client'
import { WrapperError } from './Error'
import { Torrent } from './Torrent'
import { TorrentState, type AddTorrent, type ListTorrent, type TorrentId, type TorrentInfo, type TorrentPeerStats, type TorrentStats } from '../types/wrapper'
import { Watcher } from './Watcher'
import type { WatcherOptions } from '../types/watcher'
import type { WrapperErrorProps } from '../types/error'
import { URLSearchParams } from 'url'

export class Wrapper {
  private baseURL

  constructor (public client: Client) {
    this.baseURL = `127.0.0.1:${client.port}`
  }

  createComponent(uuid: number | string): Torrent {
    return new Torrent({ uuid }, this)
  }

  createWatcher (options: WatcherOptions & { uuid: string | number }) {
    return new Watcher({ ...options, torrent: this.createComponent(options.uuid) })
  }
  
  async getTorrents(): Promise<Torrent[] | WrapperError> {
    try {
      const result = await this.request<{ torrents: TorrentId[] }>('/torrents')
      if (result instanceof WrapperError) return result

      return result.torrents.map((torrent) => new Torrent({ uuid: torrent.info_hash }, this))
    } catch (err) {
      return err as WrapperError
    }
  }
  
  async getInfo(uuid: number | string): Promise<TorrentInfo | WrapperError> {
    try {
      return await this.request(`/torrents/${uuid}`)
    } catch (err) {
      return err as WrapperError
    }
  }

  async getPeerStats(uuid: number | string, state: 'All' | 'Live' = 'All'): Promise<TorrentPeerStats | WrapperError> {
    try {
      return await this.request(`/torrents/${uuid}/peer_stats?state=${state}`)
    } catch (err) {
      return err as WrapperError
    }
  }

  async getStatsV1<State extends TorrentState>(
    uuid: number | string
  ): Promise<TorrentStats<State> | WrapperError> {
    try {
      const response = await this.request<TorrentStats<State>>(`/torrents/${uuid}/stats/v1`)
      if (response instanceof WrapperError) return response
  
      switch (response.state) {
      case 'initializing': {
        return {
          ...response,
          state: TorrentState.Initializing,
        } as TorrentStats<TorrentState.Initializing> as TorrentStats<State>
      }
      case 'paused': {
        return {
          ...response,
          state: TorrentState.Paused,
        } as TorrentStats<TorrentState.Paused> as TorrentStats<State>
      }
      case 'live': {
        return {
          ...response,
          state: TorrentState.Live,
        } as TorrentStats<TorrentState.Live> as TorrentStats<State>
      }
      case 'error': {
        return {
          ...response,
          state: TorrentState.Error,
        } as TorrentStats<TorrentState.Error> as TorrentStats<State>
      }
      default : {
        return response
      }
      }

    } catch (err) {
      return err as WrapperError
    }
  }

  async add({ magnet, outputFolder, overwrite }: {
    magnet: string,
    overwrite?: boolean,
    /**
     * The folder to download to.
     * If not specified, defaults to the one that rqbit server started with
     */
    outputFolder?: string
  }): Promise<AddTorrent | WrapperError> {
    const query: Record<string, string> = {}

    query.overwrite = String(overwrite ?? false)
    if (outputFolder) query.outputFolder = outputFolder
    console.log(new URLSearchParams(query))
    
    try {
      return await this.request('/torrents?' + new URLSearchParams(query), magnet, 'POST')
    } catch (err) {
      return err as WrapperError
    }
  }

  async list(magnet: string): Promise<ListTorrent | WrapperError> {
    try {
      return await this.request('/torrents?list_only=true', magnet, 'POST')
    } catch (err) {
      return err as WrapperError
    }
  }

  async delete(uuid: number | string): Promise<boolean | WrapperError> {
    try {
      return await this.request(`/torrents/${uuid}/delete`, undefined, 'POST')
    } catch (err) {
      return err as WrapperError

    }
  }

  async forget(uuid: number | string): Promise<boolean | WrapperError> {
    try {
      return await this.request(`/torrents/${uuid}/forget`, undefined, 'POST')
    } catch (err) {
      return err as WrapperError

    }
  }

  async pause(uuid: number | string): Promise<boolean | WrapperError> {
    try {
      return await this.request(`/torrents/${uuid}/pause`, undefined, 'POST')
    } catch (err) {
      return err as WrapperError

    }
  }

  async start(uuid: number | string): Promise<boolean | WrapperError> {
    try {
      return await this.request(`/torrents/${uuid}/start`, undefined, 'POST')
    } catch (err) {
      return err as WrapperError
    }
  }

  private async request<T>(url: string, options: Record<string, unknown> | string | undefined = undefined, method: string = 'GET'): Promise<T | WrapperError> {
    try {
      const response = await fetch('http://' + this.baseURL + url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        ...(method !== 'GET' && method !== 'HEAD' && method !== 'OPTIONS'
          ? { body: typeof options === 'string' ? options : JSON.stringify(options) }
          : {})
      })

      const json = await response.json()

      if (response.status !== 200) {
        return new WrapperError(json as unknown as WrapperErrorProps)
      }
      
      if (Object.keys(json).length === 0) {
        if (response.status === 200) return true as T
      }

      return json as T
    } catch (err) {
      if (err instanceof Error) {
        console.log(JSON.stringify(err, null, 2))
        throw new WrapperError({
          error_kind: err.name,
          human_readable: err.message,
          status_text: err.message,
          status: 400
        })
      }
      throw new Error(typeof err === 'object' ? JSON.stringify(err) : String(err))
    }
  }
}
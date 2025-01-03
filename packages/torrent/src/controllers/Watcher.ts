import type { WatcherOptions } from '../types/watcher'
import { TorrentState } from '../types/wrapper'
import type { Torrent } from './Torrent'

export class Watcher {
  public state: TorrentState = TorrentState.Initializing

  constructor (public options: WatcherOptions & { torrent: Torrent }) {
    this.init()
  }

  init () {
    const { torrent } = this.options
    const intervalId = setInterval(async () => {
      const [infoResponse, peerStatsResponse, statsResponse] = await Promise.all([
        torrent.info(),
        torrent.peerStats(),
        torrent.stats()
      ])

      if (!(statsResponse instanceof Error)) {
        if (this.state !== TorrentState.Paused && statsResponse.state === TorrentState.Paused) {
          this.options.onPaused?.()
        }
        if (this.state === TorrentState.Paused && statsResponse.state === TorrentState.Live) {
          this.options.onResume?.()
        }
        this.state = statsResponse.state
        if (statsResponse.state === TorrentState.Paused && this.options.continueOnPaused === false) return

        if (statsResponse.finished) {
          this.options.onCompleted?.()
          clearInterval(intervalId)
        }
      }

      this.options.onRequest?.({
        info: infoResponse,
        peerStats: peerStatsResponse,
        stats: statsResponse
      })
    }, this.options.interval)
  }
}
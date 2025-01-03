import type { TorrentOptions } from '../types/torrent'
import type { TorrentInfo, TorrentPeerStats, TorrentState, TorrentStats } from '../types/wrapper'
import type { Wrapper } from './Wrapper'

export class Torrent {
  public readonly uuid: string | number

  constructor (options: TorrentOptions, private wrapper: Wrapper) {
    this.uuid = options.uuid
  }

  async info (): Promise<TorrentInfo | Error> {
    return this.wrapper.getInfo(this.uuid)
  }
    
  async peerStats(): Promise<TorrentPeerStats | Error> {
    return this.wrapper.getPeerStats(this.uuid)
  }

  async stats(): Promise<TorrentStats<TorrentState> | Error> {
    return this.wrapper.getStatsV1(this.uuid)
  }

  async delete () {
    return this.wrapper.delete(this.uuid)
  }
  async forget () {
    return this.wrapper.forget(this.uuid)
  }
  async pause () {
    return this.wrapper.pause(this.uuid)
  }
  async start () {
    return this.wrapper.start(this.uuid)
  }
  async update_only_files () {}
}
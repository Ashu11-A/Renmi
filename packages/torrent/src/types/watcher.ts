import type { TorrentInfo, TorrentPeerStats, TorrentState, TorrentStats } from './wrapper'

export type WatcherOptions = WatcherFunctions & {
    interval: number
    continueOnPaused?: boolean
    continueOnCompleted?: boolean
}

export type WatcherFunctions = {
    onRequest?: (data: {
        info: TorrentInfo | Error,
        peerStats: TorrentPeerStats | Error,
        stats: TorrentStats<TorrentState> | Error
    }) => void
    onPaused?: () => void
    onCompleted?: () => void
    onResume?: () => void
}

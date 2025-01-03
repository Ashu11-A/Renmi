import type { AddTorrent, TorrentInfo, TorrentState, TorrentStats } from 'torrent'
import { MethodType } from './router'
import type { ZodError } from 'zod'

export type MethodRequests = {
  '/torrent': {
    [MethodType.Get]: {
      422: {
        message: string
      }
      200: {
        message: string
        data: {
          stats: Error | TorrentStats<TorrentState>;
          info: Error | TorrentInfo;
        }[]
      }
    },
    [MethodType.Post]: {
      400: {
        message: string,
        zod: ZodError<{ magnet: string, overwrite?: boolean | undefined }>
      }
      422: {
        message: string
      }
      201: {
        message: string,
        data: AddTorrent
      }
    },
    [MethodType.Delete]: {
      400: {
        message: string
        zod: ZodError<{ uuid: string | number }>
      }
      404: {
        message: string
      }
      200: {
        message: string
        data: Record<string, boolean>
      }
    }
  },
  '/torrent/pause': {
    [MethodType.Post]: {
      400: {
        message: string
        zod: ZodError<{ uuid: string | number }>
      },
      422: {
        message: string
      },
      200: {
        message: string,
        data: Record<string, boolean>
      }
    }
  },
  '/torrent/resume': {
    [MethodType.Post]: {
      400: {
        message: string
        zod: ZodError<{ uuid: string | number }>
      },
      422: {
        message: string
      },
      200: {
        message: string,
        data: Record<string, boolean>
      }
    }
  }
} 
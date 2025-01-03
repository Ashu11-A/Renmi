export type ClientOptions = {
    directory: string
    log?: boolean
    port?: number
    singleThread?: boolean
    workerThreads?: number
    concurrentInitLimit?: number
  }
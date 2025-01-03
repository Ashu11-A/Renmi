export enum DataTypes {
    AnimeList = 'AnimeList'
}

export type AnimeTorrentData = {
    category: string
    title: string
    link: `https://nyaa.si/view/${number}`
    torrent: `https://nyaa.si/download/${number}.torrent`
    magnet: `magnet:?xt=urn:btih:${string}`
    size: string
    date: string
    seeders: number
    leechers: number
    downloads: number
}

export type AnimeListData = {
    type: DataTypes.AnimeList
    metadata: {
        hasPrevious: boolean
        previousPage?: number
        previousPageLink?: string
        hasNext: boolean
        nextPage?: number
        nextPageLink?: string
        currentPage: number
        totalPages: number
        timestamp: number
    },
    count: AnimeTorrentData[]['length']
    data: AnimeTorrentData[]
}
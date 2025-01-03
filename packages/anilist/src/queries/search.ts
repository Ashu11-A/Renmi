import { graphql } from '../gql'

export const searchAnimes = graphql(`query SearchAnimes ($search: String, $page: Int, $perPage: Int, $mediaId: Int, $sort: [MediaSort]) {
  Page(page: $page, perPage: $perPage) {
    media (type: ANIME, search: $search, id: $mediaId, sort: $sort) {
      id
      title {
        english
        native
      }
      genres
      description
      tags {
        category
        description
        id
        name
        rank
      }
      bannerImage
      coverImage {
        color
        extraLarge
        medium
      }
      trending
      isAdult
      siteUrl
      season
      popularity
      duration
      trailer {
        thumbnail
        site
        id
      }
      seasonYear
      rankings {
        allTime
        rank
        season
        year
        type
        id
        format
        context
      }
      episodes
      nextAiringEpisode {
        timeUntilAiring
        id
        episode
        airingAt
      }
      studios(isMain: true) {
        nodes {
          name
          id
        }
      }
    }
  }
}
`)

export const searchAnime = graphql(`query SearchAnime ($search: String, $mediaId: Int, $sort: [MediaSort]) {
  Media (type: ANIME, search: $search, id: $mediaId, sort: $sort) {
    id
    title {
      english
      native
    }
    genres
    description
    tags {
      category
      description
      id
      name
      rank
    }
    bannerImage
    coverImage {
      color
      extraLarge
      medium
    }
    trending
    isAdult
    siteUrl
    season
    popularity
    duration
    trailer {
      thumbnail
      site
      id
    }
    seasonYear
    rankings {
      allTime
      rank
      season
      year
      type
      id
      format
      context
    }
    episodes
    nextAiringEpisode {
      timeUntilAiring
      id
      episode
      airingAt
    }
    studios(isMain: true) {
      nodes {
        name
        id
      }
    }
  }
}
`)
import { graphql } from '../gql'

export const animeTreads = graphql(`query AnimeTreads Page {
  Page {
    mediaTrends {
      trending
      mediaId
      inProgress
      averageScore
      popularity
    }
  }
}`)
import { GraphQLClient } from 'graphql-request'
export * from './gql/gql'
export * from './gql/index'
export * from './gql/fragment-masking'
export * from './gql/graphql'
export * from './queries/search'

export const clientGraphQL = new GraphQLClient('https://graphql.anilist.co')
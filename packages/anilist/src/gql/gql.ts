/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
const documents = {
    "query SearchAnimes ($search: String, $page: Int, $perPage: Int, $mediaId: Int, $sort: [MediaSort]) {\n  Page(page: $page, perPage: $perPage) {\n    media (type: ANIME, search: $search, id: $mediaId, sort: $sort) {\n      id\n      title {\n        english\n        native\n      }\n      genres\n      description\n      tags {\n        category\n        description\n        id\n        name\n        rank\n      }\n      bannerImage\n      coverImage {\n        color\n        extraLarge\n        medium\n      }\n      trending\n      isAdult\n      siteUrl\n      season\n      popularity\n      duration\n      trailer {\n        thumbnail\n        site\n        id\n      }\n      seasonYear\n      rankings {\n        allTime\n        rank\n        season\n        year\n        type\n        id\n        format\n        context\n      }\n      episodes\n      nextAiringEpisode {\n        timeUntilAiring\n        id\n        episode\n        airingAt\n      }\n      studios(isMain: true) {\n        nodes {\n          name\n          id\n        }\n      }\n    }\n  }\n}\n": types.SearchAnimesDocument,
    "query SearchAnime ($search: String, $mediaId: Int, $sort: [MediaSort]) {\n  Media (type: ANIME, search: $search, id: $mediaId, sort: $sort) {\n    id\n    title {\n      english\n      native\n    }\n    genres\n    description\n    tags {\n      category\n      description\n      id\n      name\n      rank\n    }\n    bannerImage\n    coverImage {\n      color\n      extraLarge\n      medium\n    }\n    trending\n    isAdult\n    siteUrl\n    season\n    popularity\n    duration\n    trailer {\n      thumbnail\n      site\n      id\n    }\n    seasonYear\n    rankings {\n      allTime\n      rank\n      season\n      year\n      type\n      id\n      format\n      context\n    }\n    episodes\n    nextAiringEpisode {\n      timeUntilAiring\n      id\n      episode\n      airingAt\n    }\n    studios(isMain: true) {\n      nodes {\n        name\n        id\n      }\n    }\n  }\n}\n": types.SearchAnimeDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query SearchAnimes ($search: String, $page: Int, $perPage: Int, $mediaId: Int, $sort: [MediaSort]) {\n  Page(page: $page, perPage: $perPage) {\n    media (type: ANIME, search: $search, id: $mediaId, sort: $sort) {\n      id\n      title {\n        english\n        native\n      }\n      genres\n      description\n      tags {\n        category\n        description\n        id\n        name\n        rank\n      }\n      bannerImage\n      coverImage {\n        color\n        extraLarge\n        medium\n      }\n      trending\n      isAdult\n      siteUrl\n      season\n      popularity\n      duration\n      trailer {\n        thumbnail\n        site\n        id\n      }\n      seasonYear\n      rankings {\n        allTime\n        rank\n        season\n        year\n        type\n        id\n        format\n        context\n      }\n      episodes\n      nextAiringEpisode {\n        timeUntilAiring\n        id\n        episode\n        airingAt\n      }\n      studios(isMain: true) {\n        nodes {\n          name\n          id\n        }\n      }\n    }\n  }\n}\n"): (typeof documents)["query SearchAnimes ($search: String, $page: Int, $perPage: Int, $mediaId: Int, $sort: [MediaSort]) {\n  Page(page: $page, perPage: $perPage) {\n    media (type: ANIME, search: $search, id: $mediaId, sort: $sort) {\n      id\n      title {\n        english\n        native\n      }\n      genres\n      description\n      tags {\n        category\n        description\n        id\n        name\n        rank\n      }\n      bannerImage\n      coverImage {\n        color\n        extraLarge\n        medium\n      }\n      trending\n      isAdult\n      siteUrl\n      season\n      popularity\n      duration\n      trailer {\n        thumbnail\n        site\n        id\n      }\n      seasonYear\n      rankings {\n        allTime\n        rank\n        season\n        year\n        type\n        id\n        format\n        context\n      }\n      episodes\n      nextAiringEpisode {\n        timeUntilAiring\n        id\n        episode\n        airingAt\n      }\n      studios(isMain: true) {\n        nodes {\n          name\n          id\n        }\n      }\n    }\n  }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query SearchAnime ($search: String, $mediaId: Int, $sort: [MediaSort]) {\n  Media (type: ANIME, search: $search, id: $mediaId, sort: $sort) {\n    id\n    title {\n      english\n      native\n    }\n    genres\n    description\n    tags {\n      category\n      description\n      id\n      name\n      rank\n    }\n    bannerImage\n    coverImage {\n      color\n      extraLarge\n      medium\n    }\n    trending\n    isAdult\n    siteUrl\n    season\n    popularity\n    duration\n    trailer {\n      thumbnail\n      site\n      id\n    }\n    seasonYear\n    rankings {\n      allTime\n      rank\n      season\n      year\n      type\n      id\n      format\n      context\n    }\n    episodes\n    nextAiringEpisode {\n      timeUntilAiring\n      id\n      episode\n      airingAt\n    }\n    studios(isMain: true) {\n      nodes {\n        name\n        id\n      }\n    }\n  }\n}\n"): (typeof documents)["query SearchAnime ($search: String, $mediaId: Int, $sort: [MediaSort]) {\n  Media (type: ANIME, search: $search, id: $mediaId, sort: $sort) {\n    id\n    title {\n      english\n      native\n    }\n    genres\n    description\n    tags {\n      category\n      description\n      id\n      name\n      rank\n    }\n    bannerImage\n    coverImage {\n      color\n      extraLarge\n      medium\n    }\n    trending\n    isAdult\n    siteUrl\n    season\n    popularity\n    duration\n    trailer {\n      thumbnail\n      site\n      id\n    }\n    seasonYear\n    rankings {\n      allTime\n      rank\n      season\n      year\n      type\n      id\n      format\n      context\n    }\n    episodes\n    nextAiringEpisode {\n      timeUntilAiring\n      id\n      episode\n      airingAt\n    }\n    studios(isMain: true) {\n      nodes {\n        name\n        id\n      }\n    }\n  }\n}\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;
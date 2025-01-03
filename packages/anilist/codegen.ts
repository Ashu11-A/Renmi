import type { CodegenConfig } from '@graphql-codegen/cli'
 
const config: CodegenConfig = {
  schema: 'https://graphql.anilist.co',
  documents: ['src/**/*.ts'],
  generates: {
    './src/gql/': {
      preset: 'client',
    }
  }
}
export default config
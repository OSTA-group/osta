import { Extension, WebExtension } from '../types'

const extensions: Extension[] = [
  {
    id: 0,
    name: 'JSON-Server',
    url: 'http://localhost:3000/landmarks',
    verified: true,
    type: 'web',
    version: 1,
    urlFilterable: false,
    configured: true,
    configurationVariables: undefined,
    variables: ['language'],
  } as WebExtension,
]

export default { extensions }

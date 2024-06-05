import { MarketplaceExtension } from '../types'
import axios from 'axios'

async function getExtensions(name: string): Promise<MarketplaceExtension[]> {
  const response = await axios.get(`/api/extensions?nameContains=${name}`)
  return response.data
}

export default { getExtensions }

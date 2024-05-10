import { useQuery } from '@tanstack/react-query'
import marketplaceService from '../services/MarketplaceService'

export function useMarketplace(name: string) {

  const {
    isPending: isGettingExtensions,
    isError: isErrorGettingExtensions,
    data: extensions,
  } = useQuery({
    queryKey: ['marketplace', name],
    queryFn: () => marketplaceService.getExtensions(name),
  })

  return {
    extensions,
    isGettingExtensions,
    isErrorGettingExtensions,
  }
}

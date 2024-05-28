import { useQuery } from '@tanstack/react-query'
import marketplaceApi from '../api/MarketplaceApi'

export function useMarketplace(name: string) {
  const {
    isPending: isGettingExtensions,
    isError: isErrorGettingExtensions,
    data: extensions,
  } = useQuery({
    queryKey: ['marketplace', name],
    queryFn: () => marketplaceApi.getExtensions(name),
  })

  return {
    extensions,
    isGettingExtensions,
    isErrorGettingExtensions,
  }
}

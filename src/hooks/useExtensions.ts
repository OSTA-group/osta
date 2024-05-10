import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import ExtensionRepository from '../repository/ExtensionRepository'
import { MarketplaceExtension } from '../types'
import ExtensionService from '../services/ExtensionService'

export function useExtensions() {
  const queryClient = useQueryClient()

  const {
    isPending: isGettingInstalledExtensions,
    isError: isErrorGettingInstalledExtensions,
    data: installedExtensions,
  } = useQuery({
    queryKey: ['extensions'],
    queryFn: () => ExtensionRepository.getExtensions(),
  })

  const {
    mutate: downloadNewExtension,
    isPending: isDownloadingExtension,
    isSuccess: isSuccessDownloadingExtension,
    isError: isErrorDownloadingExtension,
    error: errorDownloadingExtension
  } = useMutation({
    mutationFn: (newExtension: MarketplaceExtension) => ExtensionService.downloadNewExtension(newExtension),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['extensions'] }).then()
    },
  })

  const {
    mutate: deleteExtension,
    isPending: isDeletingExtension,
    isError: isErrorDeletingExtension,
  } = useMutation({
    mutationFn: (extensionsName: string) => ExtensionService.deleteExtension(extensionsName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['extensions'] }).then()
    },
  })

  return {
    // Get extensions
    installedExtensions,
    isGettingInstalledExtensions,
    isErrorGettingInstalledExtensions,

    // Add a new extension
    downloadNewExtension,
    isDownloadingExtension,
    isSuccessDownloadingExtension,
    isErrorDownloadingExtension,
    errorDownloadingExtension,

    // Delete an extension
    deleteExtension,
    isDeletingExtension,
    isErrorDeletingExtension,
  }
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import ExtensionRepository from '../repository/ExtensionRepository'
import { Extension } from '../types'
import ExtensionService from '../services/ExtensionService'

export function useExtension(extensionName: string) {
  const queryClient = useQueryClient()

  // Get extension
  const {
    isPending: isGettingExtension,
    isError: isErrorGettingExtension,
    data: extension,
  } = useQuery({
    queryKey: ['extension', extensionName],
    queryFn: () => ExtensionRepository.getExtensionByName(extensionName),
  })

  // Save extension configuration
  const {
    mutate: putConfiguration,
    isPending: isPuttingConfiguration,
    isError: isErrorPuttingConfiguration,
    isSuccess: isSuccessPuttingConfiguration,
  } = useMutation({
    mutationFn: ({ extension, configuration }: { extension: Extension; configuration: { [key: string]: unknown } }) =>
      ExtensionService.changeConfigurationForExtension(extension, configuration),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['extension', extensionName] }).then()
    },
  })

  return {
    // Get extension
    extension,
    isGettingExtension,
    isErrorGettingExtension,

    // Put configuration
    putConfiguration,
    isPuttingConfiguration,
    isErrorPuttingConfiguration,
    isSuccessPuttingConfiguration,
  }
}

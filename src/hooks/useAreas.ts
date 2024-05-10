import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import AreaRepository from '../repository/AreaRepository'
import LandmarkService from '../services/LandmarkService'

export function useAreas() {
  const queryClient = useQueryClient()

  const {
    isPending: isGettingAreas,
    isError: isErrorGettingAreas,
    data: areas,
  } = useQuery({
    queryKey: ['areas'],
    queryFn: () => AreaRepository.getAreas(),
  })

  const {
    mutate: removeArea,
    isPending: isRemovingArea,
    isError: isErrorRemovingArea,
  } = useMutation({
    mutationFn: (areaId: number) => LandmarkService.removeAreaAndLandmarks(areaId),
    onSuccess: () => {
      // Reload members
      queryClient.invalidateQueries({ queryKey: ['areas'] }).then()
      queryClient.invalidateQueries({ queryKey: ['landmarks'] }).then()
    },
  })

  return {
    // Loading areas
    areas,
    isGettingAreas,
    isErrorGettingAreas,

    // Removing area
    removeArea,
    isRemovingArea,
    isErrorRemovingArea,
  }
}

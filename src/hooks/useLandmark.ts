import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import LandmarkService from '../repository/LandmarkRepository'

export function useLandmark(landmarkId: string) {
  const queryClient = useQueryClient()

  // Get Landmark Details
  const {
    isPending: isGettingLandmarkDetails,
    isError: isErrorGettingDetails,
    data: landmarkDetails,
  } = useQuery({
    queryKey: ['landmark_details', landmarkId],
    queryFn: () => LandmarkService.getLandmarkById(landmarkId),
  })

  // Put boolean visited
  const {
    mutate: putIsVisited,
    isPending: isPostingVisited,
    isError: isErrorPositingVisited,
    isSuccess: isSuccessPositingVisited,
  } = useMutation({
    mutationFn: (checked: boolean) => LandmarkService.putIsVisitedLandmark(landmarkId, checked),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landmark_details', landmarkId] }).then()
      queryClient.invalidateQueries({ queryKey: ['landmarks'] }).then()
    },
  })

  return {
    // Get Landmark Details
    landmarkDetails,
    isGettingLandmarkDetails,
    isErrorGettingDetails,

    // Put has been visited
    putIsVisited,
    isPostingVisited,
    isErrorPositingVisited,
    isSuccessPositingVisited,
  }
}

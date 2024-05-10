import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Landmark } from '../types'
import TripService from '../services/TripService'

export function useTrip() {
  const queryClient = useQueryClient()

  const {
    isPending: isGettingTrip,
    isError: isErrorGettingTrip,
    data: trip,
  } = useQuery({
    queryKey: ['trip'],
    queryFn: () => TripService.getTrip(),
  })

  const {
    mutate: changeToNextLandmark,
    isPending: isChangingToNextLandmark,
    isError: isErrorChangingToNextLandmark,
  } = useMutation({
    mutationFn: () => TripService.setNextLandmarkInTrip(),
    onSuccess: () => {
      // Reload members
      queryClient.invalidateQueries({ queryKey: ['trip'] }).then()
      queryClient.invalidateQueries({ queryKey: ['landmarks'] }).then()
    },
  })

  const {
    mutate: changeTrip,
    isPending: isChangingTrip,
    isError: isErrorChangingTrip,
  } = useMutation({
    mutationFn: ({ landmark, addToTrip }: { landmark: Landmark; addToTrip: boolean }) =>
      addToTrip ? TripService.addLandmarkToTrip(landmark) : TripService.removeLandmarkFromTrip(landmark),
    onSuccess: () => {
      // Reload members
      queryClient.invalidateQueries({ queryKey: ['trip'] }).then()
      queryClient.invalidateQueries({ queryKey: ['landmarks'] }).then()
    },
  })

  const {
    mutate: changeTripOrder,
    isPending: isChangingTripOrder,
    isError: isErrorChangingTripOrder,
  } = useMutation({
    mutationFn: ({ landmarkIndex1, landmarkIndex2 }: { landmarkIndex1: number; landmarkIndex2: number }) =>
      TripService.flipOrder(landmarkIndex1, landmarkIndex2),
    onSuccess: () => {
      // Reload members
      queryClient.invalidateQueries({ queryKey: ['trip'] }).then()
      queryClient.invalidateQueries({ queryKey: ['landmarks'] }).then()
    },
  })

  const { mutate: startTrip } = useMutation({
    mutationFn: () => TripService.startTrip(),
    onSuccess: () => {
      // Reload members
      queryClient.invalidateQueries({ queryKey: ['trip'] }).then()
      queryClient.invalidateQueries({ queryKey: ['landmarks'] }).then()
    },
  })

  const { mutate: endTrip } = useMutation({
    mutationFn: () => TripService.endTrip(),
    onSuccess: () => {
      // Reload members
      queryClient.invalidateQueries({ queryKey: ['trip'] }).then()
      queryClient.invalidateQueries({ queryKey: ['landmarks'] }).then()
    },
  })

  return {
    // Loading trips
    trip,
    isGettingTrip,
    isErrorGettingTrip,

    // Show next in order
    changeToNextLandmark,
    isChangingToNextLandmark,
    isErrorChangingToNextLandmark,

    // Adding new landmark to trip
    changeTrip,
    isChangingTrip,
    isErrorChangingTrip,

    // Trip order
    changeTripOrder,
    isChangingTripOrder,
    isErrorChangingTripOrder,

    // Trip Status
    startTrip,
    endTrip,
  }
}

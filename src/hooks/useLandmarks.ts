import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { BoundingBox } from '../types'
import LandmarkService from '../services/LandmarkService'
import LandmarkRepository from '../repository/LandmarkRepository'
import { useState } from 'react'
import { Simulate } from 'react-dom/test-utils'
import error = Simulate.error

export function useLandmarks(area: string, name: string) {
  const queryClient = useQueryClient()

  const {
    isPending: isGettingLandmarks,
    isError: isErrorGettingLandmarks,
    data: landmarks,
  } = useQuery({
    queryKey: ['landmarks', area, name],
    queryFn: () => LandmarkRepository.getLandmarksByAreaAndName(area, name),
  })

  const [sourceName, setSourceName] = useState<string>('')

  const {
    mutate: downloadNewLandmarks,
    isSuccess: isDownloadSuccess,
    isPending: isDownloadingLandmark,
    isError: isErrorDownloadingLandmark,
  } = useMutation({
    mutationFn: ({ areaName, boundingBox }: { areaName: string; boundingBox: BoundingBox }) =>
      LandmarkService.downloadLandmarksForNewArea(areaName, boundingBox, setSourceName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landmarks'] }).then()
      queryClient.invalidateQueries({ queryKey: ['areas'] }).then()
    },
    onError: (error => {
      console.error(`failed to download landmarks ${error}`)
    }),
  })

  return {
    // Loading landmarks
    landmarks,
    isGettingLandmarks,
    isErrorGettingLandmarks,

    // Adding new landmark
    downloadNewLandmarks,
    isDownloadSuccess,
    isDownloadingLandmark,
    isErrorDownloadingLandmark,
    sourceName,
  }
}

let compassRotation = 0

async function trackUserRotation(): Promise<void> {
  window.addEventListener(
    'deviceorientationabsolute',
    (e: DeviceOrientationEvent) => {
      if (e.alpha) {
        compassRotation = 360 - e.alpha
      }
    },
    true
  )
}

function getCompassRotation(): number {
  return compassRotation
}

export default { trackUserRotation, getCompassRotation }

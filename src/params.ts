export const plotWidth = 500
export const plotHeight = 500

/** 0..1 with 1/precision step */
export const tPrecision = 1000

/** Points equal [segments + 1] e.g. 100 points will make up 99 segments */
export const lerpPoints = 100

/** 0..1 */
export const initialTValue = 0.5

export const order = 10

export const ctxStyles = {
  segmentPoint: 'rgba(255, 255, 255, 0.4)',
  lastSegmentPoint: 'rgba(255, 255, 255, 0.8)',
  segmentLine: 'rgba(255, 255, 255, 0.4)',
  gridLine: 'rgba(255, 255, 255, 0.05)',
  curveColor: 'rgba(255, 255, 255, 0.8)',
  curveWidth: 3,
} as const

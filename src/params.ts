export const plotWidth = 500
export const plotHeight = 500

export const minLerpPts = 2
export const maxLerpPts = 1000

export const minOrder = 2
export const maxOrder = 100

export const initials = {
  /** 0..1 with 1/precision step */
  tPrecision: 1000,
  /** Points equal segments+1 e.g. 100 points will make up 99 segments */
  lerpPoints: 100,
  /** 0..1 */
  tValue: 0.5,
  /** Bezier curve order, used to generate control pints */
  order: 8,
}

export const ctxStyles = {
  segmentPoint: 'rgba(255, 255, 255, 0.4)',
  lastSegmentPoint: 'rgba(255, 255, 255, 0.8)',
  segmentLine: 'rgba(255, 255, 255, 0.4)',
  gridLine: 'rgba(255, 255, 255, 0.05)',
  curveColor: 'rgba(255, 255, 255, 0.8)',
  curveWidth: 3,
} as const

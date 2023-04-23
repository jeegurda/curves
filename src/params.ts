export const plotWidth = 500
export const plotHeight = 500

export const minLerpPts = 2
export const maxLerpPts = 1000

export const minOrder = 1
export const maxOrder = 100

export const minTPrecision = 1
export const maxTPrecision = 10000

export const initials = {
  /** t value will be controlled with 1/precision step. Must be >= 1 */
  tPrecision: 100,
  /** Points equal segments+1 e.g. 100 points will make up 99 segments */
  lerpPoints: 101,
  /** 0..1 */
  tValue: 0.5,
  /** Bezier curve order, used to generate control points */
  order: 8,
}

export const ctxStyles = {
  gridLine: 'rgba(255, 255, 255, 0.03)',

  segmentLine: 'rgba(255, 255, 255, 0.2)',
  segmentPoint: 'rgba(255, 255, 255, 0.1)',
  lastSegmentPoint: 'rgba(240, 0, 100, 0.8)',

  curveColor: 'rgba(255, 255, 255, 0.8)',
  curveWidth: 3,
} as const

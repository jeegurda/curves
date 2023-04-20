import { initialTValue, order } from '../params'
import { IPlot, Point } from '../types'
import { rnd, te } from '../utils'

// prettier-ignore

// Bounds for randomizer.
// 4xOrder matrix with areas defined by:
// x, y, width, height
const rndBounds = [
  0,    0,    0.2,  0.2,
  0.8,  0,    0.2,  0.2,
  0.5,  0.5,  0.2,  0.2,
  0.8,  0.8,  0.2,  0.2,
  0,    0.7,  0.3,  0.3,
]

export const randomizePts = (pts: Point[], width: number, height: number) => {
  pts.forEach((pt, idx) => {
    const rx = rndBounds[(idx * 4) % rndBounds.length]
    const ry = rndBounds[(idx * 4 + 1) % rndBounds.length]
    const rw = rndBounds[(idx * 4 + 2) % rndBounds.length]
    const rh = rndBounds[(idx * 4 + 3) % rndBounds.length]
    pt[0] = rx * width + rnd(rw * width)
    pt[1] = ry * height + rnd(rh * height)
  })
}

const drawGrid = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
) => {
  const cellSize = 50
  const strokeWidth = 1
  const strokeStyle = 'rgba(255, 255, 255, 0.05)'

  const rows = Array.from(Array(Math.floor(height / cellSize) + 1))
  const columns = Array.from(Array(Math.floor(width / cellSize) + 1))

  const grid = new Path2D()

  // offset for crisp lines
  const subpixelOffset = strokeWidth % 2 === 0 ? 0 : -0.5

  rows.forEach((_el, idx) => {
    grid.moveTo(0, idx * cellSize + subpixelOffset)
    grid.lineTo(width, idx * cellSize + subpixelOffset)
  })
  columns.forEach((_el, idx) => {
    grid.moveTo(idx * cellSize + subpixelOffset, 0)
    grid.lineTo(idx * cellSize + subpixelOffset, height)
  })

  ctx.save()
  ctx.strokeStyle = strokeStyle
  ctx.lineWidth = strokeWidth
  ctx.stroke(grid)
  ctx.restore()
}

const drawCurve = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  pts: Point[],
) => {
  return
  const path = new Path2D()

  const [sp, cp1, cp2, ep] = pts
  path.moveTo(sp[0], sp[1])

  const segments = 0

  if (segments > 0) {
    // TODO: segmented render here
  } else {
    path.bezierCurveTo(cp1[0], cp1[1], cp2[0], cp2[1], ep[0], ep[1])
  }

  ctx.save()
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'
  ctx.stroke(path)
  ctx.restore()
}

const lerp = (a: Point, b: Point, t: number): Point => {
  const s = 1 - t
  return [a[0] * s + b[0] * t, a[1] * s + b[1] * t]
}

/** Returns De Casteljau's algorithm segment points for the single set extrapolated to `t` value
 * @example get([a, b, c, d]) => [ab, bc, cd]
 */
const getDCPts = (pts: Point[], t: number) => {
  const out = []
  for (let i = 0; i < pts.length - 1; i++) {
    out.push(lerp(pts[i], pts[i + 1], t))
  }
  return out
}

/** Returns all De Casteljau's algorithm segment points extrapolated to `t` value
 * Outer set (the input set) is NOT extrapolated
 * @example get([a, b, c, d]) => [
 *  [a, b, c, d],
 *  [ab, bc, cd],
 *  [abc, bcd],
 *  [abcd],
 * ]
 */
const getAllDCPoints = (pts: Point[], t: number) => {
  const out = [pts]
  while (pts.length > 1) {
    const dcPts = getDCPts(pts, t)
    out.push(dcPts)
    pts = dcPts
  }
  return out
}

const drawSegmentLine = (
  ctx: CanvasRenderingContext2D,
  pts: Point[],
  style: string,
) => {
  if (pts.length < 2) {
    te('bad length')
  }

  const path = new Path2D()

  path.moveTo(pts[0][0], pts[0][1])
  for (let i = 1; i < pts.length; i++) {
    path.lineTo(pts[i][0], pts[i][1])
  }

  ctx.save()
  ctx.setLineDash([5, 5])
  ctx.strokeStyle = style
  ctx.stroke(path)
  ctx.restore()
}

const ctxStyles = {
  segmentPoint: 'rgba(255, 255, 255, 0.4)',
  lastSegmentPoint: 'rgba(255, 255, 255, 0.8)',
  segmentLine: 'rgba(255, 255, 255, 0.4)',
}

const drawSegmentPoint = (
  ctx: CanvasRenderingContext2D,
  pts: Point[],
  style: string,
) => {
  const path = new Path2D()

  for (let i = 0; i < pts.length; i++) {
    path.moveTo(pts[i][0], pts[i][1])
    path.ellipse(pts[i][0], pts[i][1], 3, 3, 0, 0, Math.PI * 2)
  }

  ctx.save()
  ctx.fillStyle = style
  ctx.fill(path)
  ctx.restore()
}

const drawDCSegments = (
  ctx: CanvasRenderingContext2D,
  pts: Point[],
  tValue: number,
) => {
  const segmentPoints = getAllDCPoints(pts, tValue)

  segmentPoints.forEach((p, idx) => {
    // Last set consists of a single point
    if (idx !== segmentPoints.length - 1) {
      drawSegmentLine(ctx, p, ctxStyles.segmentLine)
    }
    // First set already has points as UI elements
    if (idx !== 0) {
      drawSegmentPoint(
        ctx,
        p,
        idx === segmentPoints.length - 1
          ? ctxStyles.lastSegmentPoint
          : ctxStyles.segmentPoint,
      )
    }
  })
}

const destroyPlot = ({
  ctx,
  width,
  height,
}: {
  ctx: CanvasRenderingContext2D
  width: number
  height: number
}) => {
  ctx.clearRect(0, 0, width, height)
  // TODO: Clear UI?
}

const createPlot = ({
  canvasRef,
  width,
  height,
}: {
  canvasRef: HTMLCanvasElement
  width: number
  height: number
}): IPlot => {
  let tValue = initialTValue
  let pts: Point[] = Array.from(Array(order + 1)).map(() => [0, 0])

  randomizePts(pts, width, height)

  const ctx =
    canvasRef.getContext('2d', { desynchronized: true }) ?? te('Context died')

  const setup = () => {
    canvasRef.width = width * window.devicePixelRatio
    canvasRef.height = height * window.devicePixelRatio
    ctx.scale(devicePixelRatio, devicePixelRatio)
  }

  const drawSync = () => {
    ctx.clearRect(0, 0, width, height)
    drawGrid(ctx, width, height)
    drawCurve(ctx, width, height, pts)
    drawDCSegments(ctx, pts, tValue)
  }

  let drawCall: number | null = null

  const draw = () => {
    drawCall !== null && cancelAnimationFrame(drawCall)
    drawCall = requestAnimationFrame(drawSync)
  }

  const destroy = () => {
    destroyPlot({ ctx, width, height })
  }

  const init = () => {
    setup()
    draw()
  }

  const replacePts = (newPts: Point[]) => {
    pts.splice(0, pts.length, ...newPts)
  }

  return {
    destroy,
    ctx,
    draw,
    pts,
    replacePts,
    init,
    props: {
      get tValue() {
        return tValue
      },
      set tValue(v) {
        if (v < 0 || v > 1) {
          console.warn('t is out of bounds: %o', v)
        }

        tValue = v
      },
    },
  }
}

const create = ({
  canvasRef,
  width,
  height,
}: {
  canvasRef: HTMLCanvasElement | null
  width: number
  height: number
}) => {
  if (canvasRef === null) {
    te('Canvas ref in null')
  }

  return createPlot({ canvasRef, width, height })
}

export { create }

import { initialTValue, order } from '../params'
import { IPlot, Point } from '../types'
import { rnd, te } from '../utils'

// prettier-ignore

// Bounds for randomizer.
// 4x4 matrix with areas defined by:
// x, y, width, height
const rndBounds = [
  0,    0,    0.2,  0.2,
  0.5,  0,    0.5,  0.5,
  0.5,  0.5,  0.5,  0.5,
  0,    0.8,  0.2,  0.2
]

export const randomizePts = (pts: Point[], width: number, height: number) => {
  pts.forEach((pt, idx) => {
    const rx = rndBounds[idx * 4]
    const ry = rndBounds[idx * 4 + 1]
    const rw = rndBounds[idx * 4 + 2]
    const rh = rndBounds[idx * 4 + 3]
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
  const path = new Path2D()

  const [sp, cp1, cp2, ep] = pts
  path.moveTo(sp[0], sp[1])

  const segments = 0

  if (segments > 0) {
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

/** Returns points for De Casteljau's algorithm segments extrapolated to tValue
 * @example getDCPts([a, b, c, d]) => [
 *  [e, f, g],
 *  [h, i],
 *  [j],
 * ]
 */
const getDCPts = (pts: Point[], t: number) => {
  const out = []
  for (let i = 0; i < pts.length - 1; i++) {
    out.push(lerp(pts[i], pts[i + 1], t))
  }
  return out
}

const drawSegmentLine = (ctx: CanvasRenderingContext2D, pts: Point[]) => {
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
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'
  ctx.stroke(path)
  ctx.restore()
}

const drawDCSegments = (
  ctx: CanvasRenderingContext2D,
  pts: Point[],
  tValue: number,
) => {
  const dcPts = getDCPts(pts, tValue)
  const dcPts2 = getDCPts(dcPts, tValue)

  drawSegmentLine(ctx, pts)
  drawSegmentLine(ctx, dcPts)
  drawSegmentLine(ctx, dcPts2)
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

  const ctx = canvasRef.getContext('2d') ?? te('Context died')

  const setup = () => {
    canvasRef.width = width * window.devicePixelRatio
    canvasRef.height = height * window.devicePixelRatio
    ctx.scale(devicePixelRatio, devicePixelRatio)
  }

  const draw = () => {
    ctx.clearRect(0, 0, width, height)
    drawGrid(ctx, width, height)
    drawCurve(ctx, width, height, pts)
    drawDCSegments(ctx, pts, tValue)
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

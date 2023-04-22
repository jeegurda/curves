import { ctxStyles, initials, maxOrder, minLerpPts, minOrder } from '../params'
import { IPlot, IPlotProps, Point } from '../types'
import { rnd, te } from '../utils'

// prettier-ignore

// Bounds for randomizer.
// 4xOrder matrix with areas defined by:
// x, y, width, height
const rndBounds = [
  0,    0,    0.1,  0.1,
  0.5,  0,    0.2,  0.2,
  0.8,  0.2,  0.2,  0.1,
  0.8,  0.6,  0.2,  0.1,
  0.8,  0.8,  0.2,  0.1,
  0,    0.9,  0.1,  0.1,
  0,    0.1,  0.1,  0.1,
  0.2,  0.7,  0.2,  0.2,
  0.8,  0,    0.3,  0.3
]

/**
 * Mutates point with random values according to its index and the matrix above
 */
const randomizePt = (
  pt: Point,
  idx: number,
  width: number,
  height: number,
): void => {
  const rx = rndBounds[(idx * 4) % rndBounds.length]
  const ry = rndBounds[(idx * 4 + 1) % rndBounds.length]
  const rw = rndBounds[(idx * 4 + 2) % rndBounds.length]
  const rh = rndBounds[(idx * 4 + 3) % rndBounds.length]
  pt[0] = rx * width + rnd(rw * width)
  pt[1] = ry * height + rnd(rh * height)
}

export const randomizePts = (
  pts: Point[],
  width: number,
  height: number,
): void => {
  pts.forEach((pt, idx) => {
    randomizePt(pt, idx, width, height)
  })
}

const drawGrid = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
) => {
  const cellSize = 50
  const strokeWidth = 1
  const strokeStyle = ctxStyles.gridLine

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
  { pts, lerpPts }: IPlotProps,
) => {
  const path = new Path2D()

  for (let t = 0; t < lerpPts; t++) {
    const [x, y] = getBezierPoint(pts, t / (lerpPts - 1))
    if (t === 0) {
      path.moveTo(x, y)
    }
    path.lineTo(x, y)
  }

  ctx.save()
  ctx.lineCap = 'round'
  ctx.strokeStyle = ctxStyles.curveColor
  ctx.lineWidth = ctxStyles.curveWidth
  ctx.stroke(path)
  ctx.restore()
}

const lerp = (a: Point, b: Point, t: number): Point => {
  const s = 1 - t
  return [a[0] * s + b[0] * t, a[1] * s + b[1] * t]
}

/**
 * Returns final De Casteljau's algorithm segment's point interpolated to `t`
 * Basically same as 'get all points' but faster and with lower memory footprint
 * @example get([a, b, c, d]) => abcd
 */
const getBezierPoint = (pts: Point[], t: number): Point => {
  const out = []
  for (let i = 0; i < pts.length - 1; i++) {
    out.push(lerp(pts[i], pts[i + 1], t))
  }

  if (out.length > 1) {
    return getBezierPoint(out, t)
  }

  return out[0]
}

/**
 * Returns De Casteljau's algorithm segment points for the single set interpolated to `t` value
 * @example get([a, b, c, d]) => [ab, bc, cd]
 */
const getDCPoints = (pts: Point[], t: number): Point[] => {
  const out = []
  for (let i = 0; i < pts.length - 1; i++) {
    out.push(lerp(pts[i], pts[i + 1], t))
  }
  return out
}

/**
 * Returns all De Casteljau's algorithm segment points interpolated to `t` value
 * Outer set (the input set) is NOT interpolated
 * @example get([a, b, c, d]) => [
 *  [a, b, c, d],
 *  [ab, bc, cd],
 *  [abc, bcd],
 *  [abcd],
 * ]
 */
const getAllDCPoints = (pts: Point[], t: number): Point[][] => {
  const out: Point[][] = [pts]
  while (pts.length > 1) {
    const dcPts = getDCPoints(pts, t)
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
  { pts, tValue }: IPlotProps,
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
  const props: IPlotProps = {
    tValue: initials.tValue,
    pts: Array.from(Array(initials.order + 1)).map(() => [0, 0]),
    lerpPts: initials.lerpPoints,
  }

  randomizePts(props.pts, width, height)

  // let savedPts: Point[] = props.pts.slice()

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
    drawCurve(ctx, props)
    drawDCSegments(ctx, props)
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

  const setOrder = (order: number) => {
    // n-th order required n+1 points
    const reqPts = order + 1

    if (reqPts < props.pts.length) {
      props.pts.splice(reqPts, props.pts.length - reqPts)
    } else if (reqPts > props.pts.length) {
      for (let i = props.pts.length; i < reqPts; i++) {
        const pt: Point = [0, 0]
        // Use next array item's index as points index for the randomizer
        randomizePt(pt, props.pts.length, width, height)
        props.pts.push(pt)
      }
    }
  }

  return {
    destroy,
    ctx,
    draw,
    init,
    setOrder,
    props: {
      get tValue() {
        return props.tValue
      },
      set tValue(v) {
        if (v < 0 || v > 1) {
          console.warn('t value %o is out of bounds', v)
        }

        props.tValue = v
      },

      get lerpPts() {
        return props.lerpPts
      },
      set lerpPts(v) {
        if (v < minLerpPts) {
          console.warn('lerp pts value %o is out of bounds', v)
        }

        props.lerpPts = v
      },

      get pts() {
        return props.pts
      },
      set pts(v) {
        if (v.length !== props.pts.length) {
          console.warn(
            "Pts array %o does not match current pts array's %o length. Use setOrder",
            v,
            props.pts,
          )
        }

        props.pts.splice(0, props.pts.length, ...v)
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

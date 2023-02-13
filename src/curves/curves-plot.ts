import { Point } from '../types'
import { rnd } from '../utils'

const order = 3

// prettier-ignore

// Bounds for randomizer.
// 4x4 matrix with areas defined by 4 pts:
// x, y, width, height
const rndBounds = [
  0,    0,    0.2,  0.2,
  0.5,  0,    0.5,  0.5,
  0.5,  0.5,  0.5,  0.5,
  0,    0.8,  0.2,  0.2
]

const randomizePts = (pts: Point[], width: number, height: number) => {
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

  ctx.strokeStyle = strokeStyle
  ctx.lineWidth = strokeWidth
  ctx.stroke(grid)
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
  path.bezierCurveTo(cp1[0], cp1[1], cp2[0], cp2[1], ep[0], ep[1])

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'
  ctx.stroke(path)
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
}

const createPlot = ({
  ref,
  width,
  height,
}: {
  ref: HTMLCanvasElement
  width: number
  height: number
}) => {
  const pts: Point[] = Array.from(Array(order + 1)).map(() => [0, 0])
  randomizePts(pts, width, height)

  const ctx = ref.getContext('2d')

  if (ctx === null) {
    throw new Error('Context died')
  }

  const setup = () => {
    ref.width = width * window.devicePixelRatio
    ref.height = height * window.devicePixelRatio
    ctx.scale(devicePixelRatio, devicePixelRatio)
    ctx.save()
  }

  const draw = () => {
    ctx.clearRect(0, 0, width, height)
    drawGrid(ctx, width, height)
    drawCurve(ctx, width, height, pts)
  }

  setup()
  draw()

  const destroy = () => {
    destroyPlot({ ctx, width, height })
  }

  return {
    destroy,
    ctx,
    draw,
    pts,
  }
}

const init = ({
  ref,
  width,
  height,
}: {
  ref: HTMLCanvasElement | null
  width: number
  height: number
}) => {
  if (ref === null) {
    throw new Error('Canvas ref is null')
  }

  const _exposed = createPlot({ ref, width, height })

  return {
    ..._exposed,
  }
}

export { init }

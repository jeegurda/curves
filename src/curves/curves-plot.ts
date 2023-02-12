import { Point } from '../types'
import { rnd } from '../utils'

const cellSize = 50
const order = 3

const randomizePts = (pts: Point[], width: number, height: number) => {
  pts.forEach((pt) => {
    pt[0] = rnd(width)
    pt[1] = rnd(height)
  })
}

const drawGrid = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
) => {
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

  const pts: Point[] = Array.from(Array(order + 1)).map(() => [0, 0])

  randomizePts(pts, width, height)

  const ctx = ref.getContext('2d')

  if (ctx === null) {
    throw new Error('Context died')
  }

  drawGrid(ctx, width, height)

  // renderPin()
  // renderPath()

  // const points = getDCPoints(interpolationValue)

  // if (initial) {
  //   createDCElements(points)
  // }

  // renderDCElements(points)
}

export { init }

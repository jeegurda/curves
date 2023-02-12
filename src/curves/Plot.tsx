import { FunctionComponent, useMemo } from 'react'
import { PlotProps } from '../types'
import { rnd } from '../utils'
import './plot.scss'

const Plot: FunctionComponent<PlotProps> = ({
  width,
  height,
  cellSize,
  order,
}) => {
  const range = useMemo(() => {
    const rows = Array.from(Array(Math.floor(height / cellSize) + 1)).map(
      (_el, idx) => idx,
    )
    const columns = Array.from(Array(Math.floor(width / cellSize) + 1)).map(
      (_el, idx) => idx,
    )

    return { rows, columns }
  }, [width, height])

  let pts = Array.from(Array(order + 1)).map(() => [rnd(width), rnd(height)])

  console.log(pts)

  return (
    <svg viewBox={`0 0 ${height} ${width}`} style={{ width, height }}>
      <g className="grid">
        {range.rows.map((idx) => (
          <path key={idx} d={`M 0 ${idx * cellSize} H ${width}`} />
        ))}
        {range.columns.map((idx) => (
          <path key={idx} d={`M ${idx * cellSize} 0 V ${height}`} />
        ))}
      </g>
      <path className="curve" />
    </svg>
  )
}

export { Plot }

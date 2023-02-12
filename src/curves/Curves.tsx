import { FunctionComponent, useEffect } from 'react'
import './curves.scss'
import { init } from '../init'
import { Plot } from './Plot'
import { Controls } from './Controls'

const width = 500
const height = 500
const cellSize = 50
const tPrecision = 1000
const order = 3

const Curves: FunctionComponent = () => {
  useEffect(() => {
    init()
  }, [])

  return (
    <div className="container">
      <div className="plot">
        <Plot width={width} height={height} cellSize={cellSize} order={order} />
      </div>
      <div className="controls">
        <Controls tPrecision={tPrecision} />
      </div>
    </div>
  )
}

export { Curves }

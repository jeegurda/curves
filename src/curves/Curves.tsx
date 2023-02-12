import { FunctionComponent, useEffect } from 'react'
import './curves.scss'
import { Plot } from './Plot'
import { Controls } from './Controls'

const width = 500
const height = 500
const tPrecision = 1000

const Curves: FunctionComponent = () => {
  return (
    <div className="container">
      <div className="plot">
        <Plot width={width} height={height} />
      </div>
      <div className="controls">
        <Controls tPrecision={tPrecision} />
      </div>
    </div>
  )
}

export { Curves }

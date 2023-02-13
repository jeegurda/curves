import { FunctionComponent, useEffect } from 'react'
import cn from './curves.scss'
import { Plot } from './Plot'
import { Controls } from './Controls'

const width = 500
const height = 500
const tPrecision = 1000

const Curves: FunctionComponent = () => {
  return (
    <div className={cn.container}>
      <div>
        <Plot width={width} height={height} />
      </div>
      <div>
        <Controls tPrecision={tPrecision} />
      </div>
    </div>
  )
}

export { Curves }

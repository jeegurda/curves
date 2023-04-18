import { FunctionComponent, useEffect, useRef } from 'react'
import cn from './Curves.scss'
import { Plot } from './Plot'
import { Controls } from './Controls'
import * as curvesPlot from './curves-plot'
import { IPlot } from '../types'

const Curves: FunctionComponent = () => {
  const plotRef = useRef<IPlot>()

  return (
    <div className={cn.container}>
      <div>
        <Plot plotRef={plotRef} />
      </div>
      <div>
        <Controls plotRef={plotRef} />
      </div>
    </div>
  )
}

export { Curves }

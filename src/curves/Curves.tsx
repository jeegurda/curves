import { FunctionComponent } from 'react'
import cn from './Curves.scss'
import { Plot } from './Plot'
import { Controls } from './Controls'

const Curves: FunctionComponent = () => {
  return (
    <div className={cn.container}>
      <div>
        <Plot />
      </div>
      <div>
        <Controls />
      </div>
    </div>
  )
}

export { Curves }

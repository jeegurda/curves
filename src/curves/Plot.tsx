import { FunctionComponent, useEffect, useRef, useState } from 'react'
import cn from './Plot.scss'
import * as curvesPlot from './curves-plot'
import { plotHeight, plotWidth } from '../params'
import { Point } from '../types'
import { te } from '../utils'

const Plot: FunctionComponent = () => {
  // const pts = useSelector((state: RootState) => state.pts)
  // const dispatch = useDispatch<AppDispatch>()

  const [localPts, setLocalPts] = useState<Point[]>([])
  const plotRef = useRef<ReturnType<typeof curvesPlot.create>>()

  useEffect(() => {
    plotRef.current = curvesPlot.create({
      canvasRef: canvasRef.current,
      uiRef: uiRef.current,
      width: plotWidth,
      height: plotHeight,
    })

    // dispatch(mainSlice.actions.setPts(plot.pts))
    setLocalPts(plotRef.current.pts)

    return () => {
      if (!plotRef.current) {
        te('Plot ref is not set')
      }

      plotRef.current.destroy()
    }
  }, [])

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const uiRef = useRef<HTMLDivElement>(null)

  const handleDown = (evt: React.MouseEvent, idx: number) => {
    evt.preventDefault()
    const evX = evt.clientX
    const evY = evt.clientY
    const [ptX, ptY] = localPts[idx]

    const handleMove = (evt: MouseEvent) => {
      setLocalPts((lpts) => {
        const newPts = lpts.slice()
        const x = Math.max(0, Math.min(plotWidth, ptX + evt.clientX - evX))
        const y = Math.max(0, Math.min(plotHeight, ptY + evt.clientY - evY))

        newPts[idx][0] = x
        newPts[idx][1] = y

        if (!plotRef.current) {
          te('Plot ref is not set')
        }
        plotRef.current.pts[idx][0] = x
        plotRef.current.pts[idx][1] = y
        plotRef.current.draw()

        return newPts
      })
    }

    const handleUp = () => {
      document.removeEventListener('mousemove', handleMove)
      document.addEventListener('mouseup', handleUp)
    }

    document.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseup', handleUp)
  }

  return (
    <div
      className={cn.container}
      style={{ width: plotWidth, height: plotHeight }}
    >
      <div className={cn.canvas}>
        <canvas ref={canvasRef}>Plot</canvas>
      </div>
      <div className={cn.ui} ref={uiRef}>
        {localPts.map((pt, idx) => (
          <div
            className={cn.pin}
            key={idx}
            style={{ transform: `translate(${pt[0]}px, ${pt[1]}px)` }}
            onMouseDown={(evt) => {
              handleDown(evt, idx)
            }}
          >
            <span className={cn.marker}></span>
            <div className={cn.label}>{`${pt[0]},${pt[1]}`}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export { Plot }

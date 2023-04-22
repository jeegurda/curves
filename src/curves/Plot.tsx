import { FunctionComponent, useEffect, useRef, useState } from 'react'
import cn from './Plot.scss'
import * as curvesPlot from './curves-plot'
import { plotHeight, plotWidth } from '../params'
import { IPlot, Point, RootState } from '../types'
import { te } from '../utils'
import { useSelector } from 'react-redux'

interface Props {
  plotRef: React.MutableRefObject<IPlot | undefined>
}

const Plot: FunctionComponent<Props> = ({ plotRef }) => {
  const syncUI = useSelector((state: RootState) => state.syncUI)

  const [localPts, setLocalPts] = useState<Point[]>([])

  useEffect(() => {
    const plot = curvesPlot.create({
      canvasRef: canvasRef.current,
      width: plotWidth,
      height: plotHeight,
    })

    plot.init()

    setLocalPts(plot.props.pts)

    plotRef.current = plot

    return () => {
      plot.destroy()
    }
  }, [])

  useEffect(() => {
    const plot = plotRef.current ?? te('Plot ref is not set')

    setLocalPts(plot.props.pts)
  }, [syncUI])

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

        const plot = plotRef.current ?? te('Plot ref is not set')

        plot.props.pts[idx][0] = x
        plot.props.pts[idx][1] = y
        plot.draw()

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

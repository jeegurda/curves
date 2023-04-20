import {
  ChangeEvent,
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from 'react'
import {
  initialTValue,
  order,
  plotHeight,
  plotWidth,
  tPrecision,
} from '../params'
import { AppDispatch, IPlot, Point } from '../types'
import { te } from '../utils'
import { useDispatch } from 'react-redux'
import { mainSlice } from '../root/store'
import { randomizePts } from './curves-plot'
import cn from './Controls.scss'

const validatePts = (pts: unknown): Point[] => {
  if (
    Array.isArray(pts) &&
    pts.length === order + 1 &&
    pts.every(
      (pt: unknown) =>
        Array.isArray(pt) &&
        pt.length === 2 &&
        pt.every((ptCoord) => typeof ptCoord === 'number'),
    )
  ) {
    // looking good
    return pts
  }

  te('Failed to parse pts')
}

interface Props {
  plotRef: React.MutableRefObject<IPlot | undefined>
}

const Controls: FunctionComponent<Props> = ({ plotRef }) => {
  const dispatch = useDispatch<AppDispatch>()
  const [lsHasPts, setLSHasPts] = useState(() => 'pts' in localStorage)

  const savePts = useCallback(() => {
    const plot = plotRef.current ?? te('Plot ref is not set')

    localStorage.pts = JSON.stringify(plot.pts)
    setLSHasPts(true)
  }, [])

  const loadPts = useCallback(() => {
    try {
      const parsedPts = JSON.parse(localStorage.pts)

      validatePts(parsedPts)

      const plot = plotRef.current ?? te('Plot ref is not set')
      plot.replacePts(parsedPts)
      plot.draw()

      dispatch(mainSlice.actions.syncUi())
    } catch (e) {
      console.warn('Failed to parse LS string %o: %o', localStorage.pts, e)

      delete localStorage.pts
      setLSHasPts(false)
    }
  }, [])

  const handleRandomize = () => {
    const plot = plotRef.current ?? te('Plot ref is not set')

    randomizePts(plot.pts, plotWidth, plotHeight)
    plot.draw()
    dispatch(mainSlice.actions.syncUi())
  }

  const tValueInput = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(evt.target.value)
    setTValue(value)

    const plot = plotRef.current ?? te('Plot ref is not set')
    plot.props.tValue = value / tPrecision
    plot.draw()
  }

  const [tValue, setTValue] = useState(Math.floor(initialTValue * tPrecision))

  return (
    <div>
      <div className={cn.line}>
        <span>{(tValue / tPrecision).toFixed(Math.log10(tPrecision))}</span>
        <input
          type="range"
          min={0}
          max={tPrecision}
          onInput={tValueInput}
          value={tValue}
        />
      </div>
      <div className={cn.line}>
        <span>Segments</span>
        <input type="number" min="0" />
      </div>
      <div className={cn.line}>
        <button onClick={handleRandomize}>Randomize points</button>
      </div>
      <div className={cn.line}>
        <button onClick={savePts}>Remember points</button>
        <button onClick={loadPts} disabled={!lsHasPts}>
          Restore points
        </button>
      </div>
    </div>
  )
}

export { Controls }

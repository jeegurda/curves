import {
  ChangeEvent,
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  initials,
  minLerpPts,
  maxLerpPts,
  plotHeight,
  plotWidth,
  maxOrder,
  minOrder,
} from '../params'
import { AppDispatch, IPlot, Point, RootState } from '../types'
import { te } from '../utils'
import { useDispatch, useSelector } from 'react-redux'
import { mainSlice } from '../root/store'
import { randomizePts } from './curves-plot'
import cn from './Controls.scss'
import * as React from 'react'

const validatePts = (pts: unknown): Point[] => {
  if (
    Array.isArray(pts) &&
    pts.length >= minOrder &&
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
  const syncUI = useSelector((state: RootState) => state.syncUI)

  const savePts = useCallback(() => {
    const plot = plotRef.current ?? te('Plot ref is not set')

    localStorage.pts = JSON.stringify(plot.props.pts)
    setLSHasPts(true)
  }, [])

  const loadPts = useCallback(() => {
    try {
      const parsedPts = validatePts(JSON.parse(localStorage.pts))

      const plot = plotRef.current ?? te('Plot ref is not set')
      if (parsedPts.length !== plot.props.pts.length) {
        plot.setOrder(parsedPts.length - 1)
      }
      plot.props.pts = parsedPts
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
    randomizePts(plot.props.pts, plotWidth, plotHeight)
    plot.draw()
    dispatch(mainSlice.actions.syncUi())
  }

  const handleTValueInput = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(evt.target.value)
    setTValue(value)

    const plot = plotRef.current ?? te('Plot ref is not set')
    plot.props.tValue = value / initials.tPrecision
    plot.draw()
  }

  const handleLerpPtsInput = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(evt.target.value)

    setLerpPtsValue(value)

    const plot = plotRef.current ?? te('Plot ref is not set')
    plot.props.lerpPts = value
    plot.draw()
  }

  const handleOrderInput = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(evt.target.value)

    setOrder(value)

    const plot = plotRef.current ?? te('Plot ref is not set')
    plot.setOrder(value)
    plot.draw()

    dispatch(mainSlice.actions.syncUi()) // update control points
  }

  const [tValue, setTValue] = useState(
    Math.floor(initials.tValue * initials.tPrecision),
  )
  const [lerpPtsValue, setLerpPtsValue] = useState(initials.lerpPoints)
  const [order, setOrder] = useState(initials.order)

  useEffect(() => {
    const plot = plotRef.current ?? te('Plot ref is not set')

    // Only order can be changed outside react ui (for now)
    // thus it requires to be updated via syncUI
    setOrder(plot.props.pts.length - 1)
  }, [syncUI])

  return (
    <div>
      <div className={cn.line}>
        <span>
          t:
          {(tValue / initials.tPrecision).toFixed(
            Math.log10(initials.tPrecision),
          )}
        </span>
        <input
          type="range"
          min={0}
          max={initials.tPrecision}
          onInput={handleTValueInput}
          value={tValue}
        />
      </div>
      <div className={cn.line}>
        <span>Interpolation points:</span>
        <span>{lerpPtsValue}</span>
        <input
          type="range"
          min={minLerpPts}
          max={maxLerpPts}
          value={lerpPtsValue}
          onInput={handleLerpPtsInput}
        />
      </div>
      <div className={cn.line}>
        <span>Curve order:</span>
        <span>{order}</span>
        <input
          type="range"
          min={minOrder}
          max={maxOrder}
          value={order}
          onInput={handleOrderInput}
        />
      </div>
      <div className={cn.line}>
        <span>Control points: </span>
        <button onClick={handleRandomize}>Randomize</button>
        {'\t'}
        <button onClick={savePts}>Save</button>
        <button onClick={loadPts} disabled={!lsHasPts}>
          Load
        </button>
      </div>
    </div>
  )
}

export { Controls }

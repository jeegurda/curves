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
  maxTPrecision,
  minTPrecision,
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
  const syncUI = useSelector((state: RootState) => state.syncUI)

  const [lsHasPts, setLSHasPts] = useState(() => 'pts' in localStorage)
  const [tPrecision, setTPrecision] = useState({
    display: String(initials.tPrecision),
    value: initials.tPrecision,
  })
  const [tValue, setTValue] = useState(
    Math.floor(initials.tValue * tPrecision.value),
  )
  const [lerpPtsValue, setLerpPtsValue] = useState(initials.lerpPoints)
  const [order, setOrder] = useState(initials.order)
  const [connectPts, setConnectPts] = useState(true)

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

  const handleTPrecisionInput = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(evt.target.value)

    if (
      !Number.isNaN(value) &&
      value >= minTPrecision &&
      value <= maxTPrecision
    ) {
      setTPrecision((state) => ({ ...state, value }))
    }
    setTPrecision((state) => ({ ...state, display: evt.target.value }))
  }

  const handleTValueInput = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(evt.target.value)
    setTValue(value)

    const plot = plotRef.current ?? te('Plot ref is not set')
    plot.props.tValue = value / tPrecision.value
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

  const handleConnectChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setConnectPts(evt.target.checked)

    const plot = plotRef.current ?? te('Plot ref is not set')

    plot.props.connectPts = evt.target.checked
    plot.draw()
  }

  useEffect(() => {
    const plot = plotRef.current ?? te('Plot ref is not set')

    // Only order can be changed outside react ui (for now)
    // thus it requires to be updated via syncUI
    setOrder(plot.props.pts.length - 1)
  }, [syncUI])

  const finalTValue: string = useMemo(() => {
    let exp

    if (tPrecision.value < 2) {
      exp = 1
    } else {
      exp = Math.floor(Math.log10(tPrecision.value - 1)) + 1
    }

    return (tValue * (1 / tPrecision.value)).toFixed(exp)
  }, [tPrecision.value, tValue])

  return (
    <div>
      <div className={cn.line}>
        <div className={cn.label}>{`t: ${finalTValue}`}</div>
        <div className={cn.rangeInput}>
          <input
            type="range"
            min={0}
            max={tPrecision.value}
            onInput={handleTValueInput}
            value={tValue}
          />
        </div>
      </div>
      <div className={cn.line}>
        <div className={cn.label}>
          {`t precision:\n(${minTPrecision}-${maxTPrecision})`}
        </div>
        <div className={cn.numInput}>
          <input
            type="number"
            min={minTPrecision}
            max={maxTPrecision}
            value={tPrecision.display}
            onInput={handleTPrecisionInput}
          />
        </div>
      </div>
      <div className={cn.line}>
        <div className={cn.label}>
          {`Interpolation points: ${lerpPtsValue}`}
        </div>
        <div className={cn.rangeInput}>
          <div>
            <input
              type="range"
              min={minLerpPts}
              max={maxLerpPts}
              value={lerpPtsValue}
              onInput={handleLerpPtsInput}
            />
          </div>
          <div>
            <label>
              <span>Connect:</span>
              <input
                type="checkbox"
                checked={connectPts}
                onChange={handleConnectChange}
              />
            </label>
          </div>
        </div>
      </div>
      <div className={cn.line}>
        <div className={cn.label}>{`Curve order: ${order}`}</div>
        <div className={cn.rangeInput}>
          <input
            type="range"
            min={minOrder}
            max={maxOrder}
            value={order}
            onInput={handleOrderInput}
          />
        </div>
      </div>
      <div className={cn.line}>
        <div className={cn.label}>Control points:</div>
        <div>
          <button onClick={handleRandomize}>Randomize</button>
          {'\t'}
          <button onClick={savePts}>Save</button>
          <button onClick={loadPts} disabled={!lsHasPts}>
            Load
          </button>
        </div>
      </div>
    </div>
  )
}

export { Controls }

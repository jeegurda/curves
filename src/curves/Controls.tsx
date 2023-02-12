import { FunctionComponent, useCallback } from 'react'
import { ControlProps } from '../types'

// let interpolationValue = Number(dom.tInput?.value) / Math.pow(10, precision) // Interpolated to 0..1

const Controls: FunctionComponent<ControlProps> = ({ tPrecision }) => {
  const savePts = useCallback(() => {
    // localStorage.pts = JSON.stringify(pts)
    // dom.load?.removeAttribute('disabled')
  }, [])
  const loadPts = useCallback(() => {
    // try {
    //   pts = JSON.parse(localStorage.pts)
    //   build()
    // } catch (e) {
    //   delete localStorage.pts
    //   dom.load?.setAttribute('disabled', '')
    // }
  }, [])

  const tValueChange = () => {
    // const target = e.target as HTMLInputElement
    // interpolationValue = Number(target.value) / Math.pow(10, precision)
    // if (dom.tValue) {
    //   dom.tValue.innerHTML = interpolationValue.toFixed(precision - 1)
    // }
    // renderDCElements(getDCPoints(interpolationValue))
  }

  const widthChange = () => {
    // dom.curve.style.setProperty('strokeWidth', dom.widthInput?.value as string)
  }

  const segmentsInc = () => {}
  const segmentsDec = () => {}

  return (
    <div>
      <div>
        <span id="t-value">0.500</span>
        <input
          type="range"
          id="t-input"
          min={0}
          max={tPrecision}
          defaultValue={tPrecision / 2}
          onChange={tValueChange}
        />
      </div>
      <div>
        <input type="text" className="segments-input" disabled />
        <button onClick={segmentsInc} className="segments-increase">
          ⬆️
        </button>
        <button onClick={segmentsDec} className="segments-decrease">
          ⬇️
        </button>
      </div>
      <div>
        <button id="randomize">Randomize points</button>
      </div>
      <div>
        <button id="save" onClick={savePts}>
          Remember points
        </button>
        <button id="load" onClick={loadPts}>
          Restore points
        </button>
      </div>
      <div>
        <input
          type="range"
          id="width-input"
          min="1"
          max="50"
          defaultValue="2"
          onChange={widthChange}
        />
      </div>
    </div>
  )
}

export { Controls }

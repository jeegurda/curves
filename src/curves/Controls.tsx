import { FunctionComponent, useCallback } from 'react'
import { tPrecision } from '../params'

// let interpolationValue = Number(dom.tInput?.value) / Math.pow(10, precision) // Interpolated to 0..1

const Controls: FunctionComponent = () => {
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

  const randomizePts = () => {}

  const tValueChange = () => {
    // const target = e.target as HTMLInputElement
    // interpolationValue = Number(target.value) / Math.pow(10, precision)
    // if (dom.tValue) {
    //   dom.tValue.innerHTML = interpolationValue.toFixed(precision - 1)
    // }
    // renderDCElements(getDCPoints(interpolationValue))
  }

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
        <span>Segments</span>
        <input type="number" />
      </div>
      <div>
        <button onClick={randomizePts}>Randomize points</button>
      </div>
      <div>
        <button onClick={savePts}>Remember points</button>
        <button onClick={loadPts}>Restore points</button>
      </div>
    </div>
  )
}

export { Controls }

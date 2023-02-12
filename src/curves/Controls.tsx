import { FunctionComponent } from 'react'
import { ControlProps } from '../types'

const Controls: FunctionComponent<ControlProps> = ({ tPrecision }) => {
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
        />
      </div>
      <div>
        <input type="text" className="segments-input" disabled />
        <button className="segments-increase">⬆️</button>
        <button className="segments-decrease">⬇️</button>
      </div>
      <div>
        <button id="randomize">Randomize points</button>
      </div>
      <div>
        <button id="save">Remember points</button>
        <button id="load">Restore points</button>
      </div>
      <div>
        <input
          type="range"
          id="width-input"
          min="1"
          max="50"
          defaultValue="2"
        />
      </div>
    </div>
  )
}

export { Controls }

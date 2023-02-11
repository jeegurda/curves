import { FunctionComponent, useEffect } from 'react'
import './curves.scss'
import { init } from '../init'

const Curves: FunctionComponent = () => {
  useEffect(() => {
    init()
  }, [])

  return <div>sup</div>
}

export { Curves }

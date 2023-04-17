import { Curves } from '../curves/Curves'
import './root.scss'
import { store } from './store'
import { Provider } from 'react-redux'

const Root = () => {
  return (
    <Provider store={store}>
      <Curves />
    </Provider>
  )
}

export { Root }
